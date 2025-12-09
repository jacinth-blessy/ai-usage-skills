import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { CreateActivitySchema, UpdateActivitySchema } from "@/shared/types";
import z from "zod";

const app = new Hono<{ Bindings: Env }>();

// Auth endpoints
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Activity endpoints
app.get("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  const date = c.req.query("date");

  let query = "SELECT * FROM activities WHERE user_id = ?";
  const params = [user.id];

  if (date) {
    query += " AND activity_date = ?";
    params.push(date);
  }

  query += " ORDER BY activity_date DESC, created_at DESC";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json(results);
});

app.post(
  "/api/activities",
  authMiddleware,
  zValidator("json", CreateActivitySchema),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");

    // Check if total minutes for the day would exceed 1440
    const { results } = await c.env.DB.prepare(
      "SELECT SUM(duration) as total FROM activities WHERE user_id = ? AND activity_date = ?"
    )
      .bind(user.id, data.activity_date)
      .all();

    const currentTotal = (results[0] as { total: number | null })?.total || 0;

    if (currentTotal + data.duration > 1440) {
      return c.json(
        {
          error: "Total minutes for this day would exceed 1440",
          remaining: 1440 - currentTotal,
        },
        400
      );
    }

    const result = await c.env.DB.prepare(
      `INSERT INTO activities (user_id, title, category, duration, activity_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    )
      .bind(user.id, data.title, data.category, data.duration, data.activity_date)
      .run();

    const { results: newActivity } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ?"
    )
      .bind(result.meta.last_row_id)
      .all();

    return c.json(newActivity[0], 201);
  }
);

app.put(
  "/api/activities/:id",
  authMiddleware,
  zValidator("json", UpdateActivitySchema),
  async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const data = c.req.valid("json");

    // Verify activity belongs to user
    const { results: existing } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ? AND user_id = ?"
    )
      .bind(id, user.id)
      .all();

    if (!existing.length) {
      return c.json({ error: "Activity not found" }, 404);
    }

    const activity = existing[0] as {
      duration: number;
      activity_date: string;
    };

    // Check if total minutes would exceed 1440
    if (data.duration !== undefined || data.activity_date !== undefined) {
      const targetDate = data.activity_date || activity.activity_date;
      const newDuration = data.duration !== undefined ? data.duration : activity.duration;

      const { results } = await c.env.DB.prepare(
        "SELECT SUM(duration) as total FROM activities WHERE user_id = ? AND activity_date = ? AND id != ?"
      )
        .bind(user.id, targetDate, id)
        .all();

      const currentTotal = (results[0] as { total: number | null })?.total || 0;

      if (currentTotal + newDuration > 1440) {
        return c.json(
          {
            error: "Total minutes for this day would exceed 1440",
            remaining: 1440 - currentTotal,
          },
          400
        );
      }
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.title !== undefined) {
      updates.push("title = ?");
      values.push(data.title);
    }
    if (data.category !== undefined) {
      updates.push("category = ?");
      values.push(data.category);
    }
    if (data.duration !== undefined) {
      updates.push("duration = ?");
      values.push(data.duration);
    }
    if (data.activity_date !== undefined) {
      updates.push("activity_date = ?");
      values.push(data.activity_date);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id, user.id);

    await c.env.DB.prepare(
      `UPDATE activities SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`
    )
      .bind(...values)
      .run();

    const { results: updated } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE id = ?"
    )
      .bind(id)
      .all();

    return c.json(updated[0]);
  }
);

app.delete("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const result = await c.env.DB.prepare(
    "DELETE FROM activities WHERE id = ? AND user_id = ?"
  )
    .bind(id, user.id)
    .run();

  if (result.meta.changes === 0) {
    return c.json({ error: "Activity not found" }, 404);
  }

  return c.json({ success: true });
});

app.get(
  "/api/analytics/:date",
  authMiddleware,
  zValidator("param", z.object({ date: z.string() })),
  async (c) => {
    const user = c.get("user");
    const { date } = c.req.valid("param");

    const { results: activities } = await c.env.DB.prepare(
      "SELECT * FROM activities WHERE user_id = ? AND activity_date = ? ORDER BY created_at ASC"
    )
      .bind(user.id, date)
      .all();

    const totalMinutes = (activities as { duration: number }[]).reduce(
      (sum, act) => sum + act.duration,
      0
    );

    const categoryBreakdown: Record<string, number> = {};
    (activities as { category: string; duration: number }[]).forEach((act) => {
      categoryBreakdown[act.category] =
        (categoryBreakdown[act.category] || 0) + act.duration;
    });

    return c.json({
      date,
      activities,
      totalMinutes,
      categoryBreakdown,
    });
  }
);

export default app;
