import { useState, useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { Plus, Edit2, Trash2, BarChart3, Sparkles } from "lucide-react";
import type { Activity } from "@/shared/types";
import ActivityModal from "@/react-app/components/ActivityModal";
import Header from "@/react-app/components/Header";

export default function Activities() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    fetchActivities();
  }, [selectedDate]);

  const fetchActivities = async () => {
    const response = await fetch(`/api/activities?date=${selectedDate}`);
    const data = await response.json();
    setActivities(data);
    const total = data.reduce((sum: number, act: Activity) => sum + act.duration, 0);
    setTotalMinutes(total);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this activity?")) return;

    await fetch(`/api/activities/${id}`, { method: "DELETE" });
    fetchActivities();
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  const handleModalSuccess = () => {
    fetchActivities();
    handleModalClose();
  };

  const remainingMinutes = 1440 - totalMinutes;
  const canAnalyze = totalMinutes === 1440;
  const isOverLimit = totalMinutes > 1440;
  const progressPercent = Math.min((totalMinutes / 1440) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient">
      <Header onLogout={handleLogout} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-violet-100/50 p-6 sm:p-8 mb-8 transition-all duration-300 hover:shadow-violet-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                Daily Activities
              </h2>
              <p className="text-gray-600 text-sm">Track your time, visualize your day</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:border-violet-300"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Activity</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Progress Card with AI-assisted design */}
          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl p-6 mb-6 border border-violet-100/50 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-600">Total Time Logged</p>
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {totalMinutes} <span className="text-xl text-gray-500">/ 1440 min</span>
                </p>
                <p className="text-sm text-gray-600">
                  {(totalMinutes / 60).toFixed(1)} hours logged
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {isOverLimit ? "Over Limit" : "Remaining"}
                </p>
                <p
                  className={`text-3xl font-bold transition-colors duration-300 ${
                    isOverLimit
                      ? "text-red-600"
                      : remainingMinutes === 0
                      ? "text-emerald-600"
                      : "text-gray-900"
                  }`}
                >
                  {Math.abs(remainingMinutes)}
                  <span className="text-lg ml-1">min</span>
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverLimit
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : canAnalyze
                    ? "bg-gradient-to-r from-emerald-500 to-green-600"
                    : "bg-gradient-to-r from-violet-500 to-fuchsia-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Analyze Button */}
            {totalMinutes > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/analytics/${selectedDate}`)}
                  disabled={!canAnalyze}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl shadow-md font-semibold transition-all duration-300 ${
                    canAnalyze
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  {canAnalyze ? "Analyze Day" : "Complete 1440 Minutes to Analyze"}
                </button>
                {!canAnalyze && !isOverLimit && (
                  <p className="text-xs text-center text-gray-500">
                    Add {remainingMinutes} more minutes to unlock analytics
                  </p>
                )}
                {isOverLimit && (
                  <p className="text-xs text-center text-red-600">
                    Remove {Math.abs(remainingMinutes)} minutes to analyze this day
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Activities List */}
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl mb-4">
                  <Plus className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No activities yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start tracking your day by adding your first activity
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add First Activity
                </button>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="bg-white border border-violet-100 rounded-xl p-4 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 hover:scale-[1.01] animate-slideIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-lg font-medium shadow-sm">
                          {activity.category}
                        </span>
                        <span className="text-gray-600 font-medium">
                          {activity.duration} min
                        </span>
                        <span className="text-gray-400">
                          ({((activity.duration / 1440) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="p-2.5 text-violet-600 hover:bg-violet-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Edit activity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Delete activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ActivityModal
          activity={editingActivity}
          selectedDate={selectedDate}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
