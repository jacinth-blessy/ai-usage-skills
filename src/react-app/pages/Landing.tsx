import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Clock, BarChart3, Calendar, CheckCircle2, Sparkles, Zap, TrendingUp } from "lucide-react";

export default function Landing() {
  const { user, redirectToLogin, isPending } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/activities");
    }
  }, [user, navigate]);

  if (isPending) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 relative overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl mb-6 sm:mb-8 shadow-2xl shadow-violet-500/40 animate-pulse-slow">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-violet-100">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-600">AI-Enhanced Time Tracking</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-6 sm:mb-8 animate-slideDown leading-tight">
            TimeFlow
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            Track your daily activities with precision. Visualize how you spend every minute of your 24-hour day with 
            <span className="font-semibold text-violet-600"> AI-powered insights</span>.
          </p>

          <button
            onClick={redirectToLogin}
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            <span>Start Tracking Free</span>
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
          </button>

          <p className="mt-4 text-sm text-gray-600">
            No credit card required • Sign in with Google in seconds
          </p>
        </div>

        {/* Features Grid - AI Generated Layout */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-violet-100/50 hover:scale-105 hover:-translate-y-1 group animate-slideIn">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
              <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Intuitive Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Log activities throughout your day with smart categories and precise minute-by-minute tracking.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100/50 hover:scale-105 hover:-translate-y-1 group animate-slideIn" style={{ animationDelay: '100ms' }}>
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">1440 Minute Balance</h3>
            <p className="text-gray-600 leading-relaxed">
              Stay within your 24-hour daily limit. Real-time progress tracking shows remaining time at a glance.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-fuchsia-100/50 hover:scale-105 hover:-translate-y-1 group animate-slideIn" style={{ animationDelay: '200ms' }}>
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-fuchsia-500/30 group-hover:shadow-fuchsia-500/50 transition-shadow">
              <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">AI-Powered Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Beautiful visualizations with AI-generated insights. See patterns in how you spend your time.
            </p>
          </div>
        </div>

        {/* AI Showcase Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-violet-100/50 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-violet-600" />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Powered by AI
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
              <TrendingUp className="w-5 h-5 text-violet-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Smart Layouts</h4>
                <p className="text-sm text-gray-600">AI-designed UI components for optimal user experience</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100">
              <Sparkles className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Color Harmony</h4>
                <p className="text-sm text-gray-600">AI-generated palettes for perfect visual balance</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-100">
              <BarChart3 className="w-5 h-5 text-fuchsia-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Data Visualization</h4>
                <p className="text-sm text-gray-600">AI-enhanced charts and graphs for clarity</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100">
              <Zap className="w-5 h-5 text-violet-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Smart Assets</h4>
                <p className="text-sm text-gray-600">AI-generated illustrations and visual elements</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to master your time?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with TimeFlow
          </p>
          <button
            onClick={redirectToLogin}
            className="inline-flex items-center gap-3 px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
