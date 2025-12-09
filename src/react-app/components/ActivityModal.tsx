import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import type { Activity } from "@/shared/types";

interface ActivityModalProps {
  activity: Activity | null;
  selectedDate: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  "Work",
  "Study",
  "Sleep",
  "Exercise",
  "Meals",
  "Commute",
  "Entertainment",
  "Social",
  "Chores",
  "Other",
];

export default function ActivityModal({
  activity,
  selectedDate,
  onClose,
  onSuccess,
}: ActivityModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setCategory(activity.category);
      setDuration(activity.duration.toString());
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      setError("Duration must be a positive number");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = activity
        ? `/api/activities/${activity.id}`
        : "/api/activities";
      const method = activity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          duration: durationNum,
          activity_date: selectedDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to save activity");
        setIsSubmitting(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError("An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-slideIn border border-violet-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {activity ? "Edit Activity" : "New Activity"}
            </h2>
            <Sparkles className="w-5 h-5 text-violet-500" />
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Activity Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-violet-300"
              placeholder="e.g., Morning workout"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-violet-300 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 hover:border-violet-300"
              placeholder="e.g., 60"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slideIn">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
            >
              {isSubmitting ? "Saving..." : activity ? "Update" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
