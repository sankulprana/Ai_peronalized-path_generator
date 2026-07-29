import { NavLink } from "react-router-dom";
import { Brain } from "lucide-react";
import { navItems } from "../data/dummyData";
import { useHeaderData } from "../context/HeaderContext";

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
  const { user } = useHeaderData();

  return (
    <>
      {/* Mobile overlay */}
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
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
            <Brain className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            PathAI
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>

        {/* User profile */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
            {user.initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-500">{user.title}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
