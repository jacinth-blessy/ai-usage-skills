import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Clock, PieChart, BarChart3, TrendingUp, Sparkles } from "lucide-react";
import type { DailyAnalytics } from "@/shared/types";
import Header from "@/react-app/components/Header";
import { useAuth } from "@getmocha/users-service/react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer as BarResponsiveContainer } from "recharts";

export default function Analytics() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [analytics, setAnalytics] = useState<DailyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (date) {
      fetchAnalytics();
    }
  }, [date]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/analytics/${date}`);
    const data = await response.json();
    setAnalytics(data);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const categoryColors: Record<string, string> = {
    Work: "#3b82f6",
    Study: "#a855f7",
    Sleep: "#6366f1",
    Exercise: "#10b981",
    Meals: "#f97316",
    Commute: "#eab308",
    Entertainment: "#ec4899",
    Social: "#f43f5e",
    Chores: "#14b8a6",
    Other: "#6b7280",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <Header onLogout={handleLogout} />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin mb-4">
            <Clock className="w-12 h-12 text-violet-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.activities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <Header onLogout={handleLogout} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate("/activities")}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-8 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Activities
          </button>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-violet-100/50 p-8 sm:p-12 text-center animate-slideIn">
            {/* AI-Generated Empty State Illustration */}
            <div className="mb-8">
              <img 
                src="https://mocha-cdn.com/019aff16-1278-7635-8c69-9831cf0caf2a/empty-state.png" 
                alt="No data available" 
                className="w-64 h-64 mx-auto object-contain opacity-90"
              />
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">AI-Ready Analytics</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              No data available yet
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-md mx-auto">
              You haven't logged any activities for <span className="font-semibold text-violet-600">{date}</span> yet.
            </p>
            <p className="text-gray-500 mb-8">
              Start tracking your day to unlock AI-powered insights and beautiful visualizations
            </p>
            
            <button
              onClick={() => navigate("/activities")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold text-lg"
            >
              <Clock className="w-5 h-5" />
              Start Logging Your Day
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedCategories = Object.entries(analytics.categoryBreakdown).sort(
    ([, a], [, b]) => b - a
  );

  const pieData = sortedCategories.map(([category, minutes]) => ({
    name: category,
    value: minutes,
    color: categoryColors[category] || categoryColors.Other,
  }));

  const barData = analytics.activities.map((activity) => ({
    name: activity.title.length > 20 ? activity.title.substring(0, 20) + "..." : activity.title,
    minutes: activity.duration,
    category: activity.category,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <Header onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/activities")}
          className="flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-8 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Activities
        </button>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-violet-100/50 p-6 sm:p-8 mb-8 animate-slideIn">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                Daily Analytics
              </h2>
              <p className="text-gray-600 text-lg">{date}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-full">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">AI Enhanced</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-violet-600" />
                <p className="text-sm font-medium text-gray-600">Total Time</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {analytics.totalMinutes}
                <span className="text-lg text-gray-500 ml-1">min</span>
              </p>
              <p className="text-sm text-gray-600">
                {(analytics.totalMinutes / 60).toFixed(1)} hours logged
              </p>
            </div>

            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-2xl p-6 border border-fuchsia-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="w-5 h-5 text-fuchsia-600" />
                <p className="text-sm font-medium text-gray-600">Categories</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {Object.keys(analytics.categoryBreakdown).length}
              </p>
              <p className="text-sm text-gray-600">
                Different activity types
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-medium text-gray-600">Activities</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {analytics.activities.length}
              </p>
              <p className="text-sm text-gray-600">
                Total activities logged
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div className="animate-slideIn" style={{ animationDelay: '100ms' }}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-600" />
                Time Distribution
              </h3>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm hover:shadow-md transition-shadow">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value} minutes`} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="animate-slideIn" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                Activity Durations
              </h3>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm hover:shadow-md transition-shadow">
                <BarResponsiveContainer width="100%" height={300}>
                  <RechartsBar data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100} 
                      fontSize={12}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                      stroke="#6b7280"
                    />
                    <BarTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <Bar 
                      dataKey="minutes" 
                      fill="url(#colorGradient)" 
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#d946ef" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                  </RechartsBar>
                </BarResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mb-8 animate-slideIn" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Category Breakdown
            </h3>
            <div className="space-y-4">
              {sortedCategories.map(([category, minutes], index) => {
                const percentage = (minutes / 1440) * 100;
                const color = categoryColors[category] || categoryColors.Other;

                return (
                  <div 
                    key={category}
                    className="animate-slideIn"
                    style={{ animationDelay: `${400 + index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-gray-900">
                          {category}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {minutes} min • {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="animate-slideIn" style={{ animationDelay: '500ms' }}>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Activity Timeline
            </h3>
            <div className="space-y-3">
              {analytics.activities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="bg-white border border-violet-100 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 hover:scale-[1.01] animate-slideIn"
                  style={{ animationDelay: `${600 + index * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h4>
                      <span 
                        className="inline-block px-3 py-1 rounded-lg text-sm font-medium text-white shadow-sm"
                        style={{ backgroundColor: categoryColors[activity.category] || categoryColors.Other }}
                      >
                        {activity.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {activity.duration}
                        <span className="text-sm ml-1">min</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((activity.duration / 1440) * 100).toFixed(1)}% of day
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
