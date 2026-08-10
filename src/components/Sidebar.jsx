import { NavLink, Link } from "react-router-dom";
import { Brain, LogOut, LogIn } from "lucide-react";
import { navItems } from "../data/dummyData";
import { useHeaderData } from "../context/HeaderContext";
import { useAuth } from "../context/AuthContext";

function NavItem({ icon: Icon, label, path }) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-violet-600 text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        ].join(" ")
      }
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar({ open = true, onClose }) {
  const { user: headerUser } = useHeaderData();
  const { user: authUser, logout } = useAuth();

  const currentUser = {
    name: authUser?.name || headerUser?.name || "Alex Chen",
    title: authUser?.title || headerUser?.title || "Learner · Lv.3",
    initial: authUser?.name ? authUser.name.charAt(0).toUpperCase() : headerUser?.initial || "A",
  };

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-[264px] shrink-0 flex-col border-r border-gray-100 bg-white px-4 py-5 transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
            <Brain className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            PathAI
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>

        {authUser ? (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5 border border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                {currentUser.initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-gray-500">{currentUser.title}</p>
              </div>
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
          <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-gray-100">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-50 py-2.5 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition-all"
            >
              <LogIn className="h-4 w-4" />
              Sign In / Sign Up
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
