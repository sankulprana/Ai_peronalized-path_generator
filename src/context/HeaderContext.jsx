import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

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
  const { user: authUser, updateUser } = useAuth();

  const [header, setHeader] = useState(() => {
    const saved = localStorage.getItem("pathai_header");
    return saved ? JSON.parse(saved) : defaultHeaderData;
  });

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Synchronize when authUser updates
  useEffect(() => {
    if (authUser) {
      setHeader((prev) => ({
        ...prev,
        goalLabel: authUser.targetGoal || prev.goalLabel,
        xp: authUser.xp !== undefined ? authUser.xp : prev.xp,
        streak: authUser.streak !== undefined ? authUser.streak : prev.streak,
        level: authUser.level || Math.floor((authUser.xp || 0) / 300) + 1,
        isOnboarded: authUser.isOnboarded !== undefined ? authUser.isOnboarded : prev.isOnboarded,
        user: {
          name: authUser.name || prev.user.name,
          title: authUser.title || `Learner · Lv.${authUser.level || 1}`,
          initial: authUser.name ? authUser.name.charAt(0).toUpperCase() : prev.user.initial,
        },
      }));
    }
  }, [authUser]);

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
    if (updateUser) {
      updateUser({
        targetGoal: data.targetGoal,
        skillLevel: data.skillLevel,
        interests: data.interests,
        weeklyHours: data.weeklyHours,
        isOnboarded: true,
      });
    }
    setIsOnboardingOpen(false);
  };

  const addXP = (amount) => {
    setHeader((prev) => {
      const newXP = Math.max(0, (prev.xp || 0) + amount);
      const newLevel = Math.floor(newXP / 300) + 1;
      const newTitle = `Learner · Lv.${newLevel}`;
      if (updateUser) {
        updateUser({ xp: newXP, level: newLevel, title: newTitle });
      }
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        user: {
          ...prev.user,
          title: newTitle,
        },
      };
    });
  };

  const setXPAbsolute = (exactXP) => {
    setHeader((prev) => {
      const newLevel = Math.floor(exactXP / 300) + 1;
      const newTitle = `Learner · Lv.${newLevel}`;
      if (updateUser) {
        updateUser({ xp: exactXP, level: newLevel, title: newTitle });
      }
      return {
        ...prev,
        xp: exactXP,
        level: newLevel,
        user: {
          ...prev.user,
          title: newTitle,
        },
      };
    });
  };

  const updateGoal = (newGoal) => {
    setHeader((prev) => ({
      ...prev,
      goalLabel: newGoal,
    }));
    if (updateUser) {
      updateUser({ targetGoal: newGoal });
    }
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
        setXPAbsolute,
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
