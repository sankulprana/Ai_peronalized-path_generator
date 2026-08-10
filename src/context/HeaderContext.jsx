import { createContext, useContext, useEffect, useState } from "react";

const defaultHeaderData = {
  pageTitle: "Dashboard",
  goalLabel: "Backend Developer",
  streak: 0,
  xp: 0,
  level: 1,
  isOnboarded: false,
  interests: ["Node.js", "Express", "REST APIs"],
  skillLevel: "beginner",
  weeklyHours: 7,
  user: { name: "Learner", title: "Learner · Lv.1", initial: "L" },
};

const HeaderContext = createContext(null);

export function HeaderProvider({ children }) {
  const [header, setHeader] = useState(() => {
    const saved = localStorage.getItem("pathai_header");
    return saved ? JSON.parse(saved) : defaultHeaderData;
  });

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!header.isOnboarded);

  useEffect(() => {
    localStorage.setItem("pathai_header", JSON.stringify(header));
  }, [header]);

  const openGoalModal = () => setIsGoalModalOpen(true);
  const closeGoalModal = () => setIsGoalModalOpen(false);

  const openQuizModal = () => setIsQuizModalOpen(true);
  const closeQuizModal = () => setIsQuizModalOpen(false);

  const openOnboarding = () => setIsOnboardingOpen(true);
  const closeOnboarding = () => setIsOnboardingOpen(false);

  const completeOnboarding = (data) => {
    setHeader((prev) => ({
      ...prev,
      goalLabel: data.targetGoal || prev.goalLabel,
      skillLevel: data.skillLevel || prev.skillLevel,
      interests: data.interests || prev.interests,
      weeklyHours: data.weeklyHours || prev.weeklyHours,
      isOnboarded: true,
    }));
    setIsOnboardingOpen(false);
  };

  const addXP = (amount) => {
    setHeader((prev) => {
      const newXP = (prev.xp || 0) + amount;
      const newLevel = Math.floor(newXP / 300) + 1;
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        user: {
          ...prev.user,
          title: `Learner · Lv.${newLevel}`,
        },
      };
    });
  };

  const updateGoal = (newGoal) => {
    setHeader((prev) => ({
      ...prev,
      goalLabel: newGoal,
    }));
  };

  return (
    <HeaderContext.Provider
      value={{
        header,
        setHeader,
        isGoalModalOpen,
        openGoalModal,
        closeGoalModal,
        isQuizModalOpen,
        openQuizModal,
        closeQuizModal,
        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,
        completeOnboarding,
        addXP,
        updateGoal,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

/** Read shared header data AND modal actions seamlessly */
export function useHeaderData() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeaderData must be used inside HeaderProvider");
  return {
    ...(ctx.header || {}),
    ...ctx,
  };
}

/** Set page title and goal label on mount */
export function usePageHeader(data) {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("usePageHeader must be used inside HeaderProvider");
  useEffect(() => {
    ctx.setHeader((prev) => ({ ...prev, ...data }));
  }, []);
}
