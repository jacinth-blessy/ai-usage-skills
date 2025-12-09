import z from "zod";

export const ActivitySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  title: z.string(),
  category: z.string(),
  duration: z.number().int().positive(),
  activity_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export const CreateActivitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.number().int().positive("Duration must be positive"),
  activity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export type CreateActivity = z.infer<typeof CreateActivitySchema>;

export const UpdateActivitySchema = CreateActivitySchema.partial();

export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;

export const DailyAnalytics = z.object({
  date: z.string(),
  activities: z.array(ActivitySchema),
  totalMinutes: z.number(),
  categoryBreakdown: z.record(z.number()),
});

export type DailyAnalytics = z.infer<typeof DailyAnalytics>;
