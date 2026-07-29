import { createContext, useContext, useEffect, useState } from "react";

const defaultHeaderData = {
  pageTitle: "Dashboard",
  goalLabel: "Frontend Developer",
  streak: 12,
  xp: 1465,
  user: { name: "Alex Chen", title: "Expert · Lv.5", initial: "A" },
};

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [header, setHeader] = useState(defaultHeaderData);
  return (
    <HeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

/** Read the current shared header/sidebar data (used by Sidebar & Topbar). */
export function useHeaderData() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeaderData must be used inside HeaderProvider");
  return ctx.header;
}

/** Let a page set the header/sidebar data it needs as soon as it mounts. */
export function usePageHeader(data) {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("usePageHeader must be used inside HeaderProvider");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    ctx.setHeader((prev) => ({ ...prev, ...data }));
  }, []);
}
