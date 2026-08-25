import { Menu, Flame, Zap, RotateCcw, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useHeaderData } from "../context/HeaderContext";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenuClick }) {
  const {
    pageTitle = "Dashboard",
    goalLabel = "Backend Developer",
    streak = 12,
    xp = 1465,
    openGoalModal,
  } = useHeaderData();
  const { user: authUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-[73px] items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[15px] font-bold leading-tight text-gray-900">
            {pageTitle}
          </h1>
          <p className="text-xs text-gray-500">Goal: {goalLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-1.5 text-sm font-semibold text-gray-900 sm:flex">
          <Flame className="h-[18px] w-[18px] text-amber-500" fill="currentColor" />
          <span>{streak}</span>
          <span className="font-medium text-gray-400">streak</span>
        </div>
        <div className="hidden items-center gap-1.5 text-sm font-semibold text-gray-900 sm:flex">
          <Zap className="h-[18px] w-[18px] text-violet-500" fill="currentColor" />
          <span>{xp}</span>
          <span className="font-medium text-gray-400">XP</span>
        </div>

        <button
          onClick={openGoalModal}
          className="flex items-center gap-1.5 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-100 transition-all active:scale-95 text-xs sm:text-sm"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Change Goal</span>
        </button>

        {authUser ? (
          <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white shadow-xs">
              {authUser.name ? authUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 transition-all"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
