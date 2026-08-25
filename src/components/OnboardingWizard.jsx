import { useState } from "react";
import {
  Sparkles,
  Target,
  BarChart2,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Brain,
  Code2,
  Cpu,
  Layers,
  Shield,
  Smartphone,
  Server,
  Zap,
} from "lucide-react";
import { useHeaderData } from "../context/HeaderContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const DOMAINS = [
  {
    id: "Backend Developer",
    title: "Backend Engineering",
    desc: "APIs, Databases, System Architecture & Microservices",
    icon: Server,
    color: "from-violet-500 to-indigo-600",
    tags: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "System Design", "REST APIs"],
  },
  {
    id: "Frontend Developer",
    title: "Frontend & UI Engineering",
    desc: "Modern Web Interfaces, React, State Management & Tailwind",
    icon: Code2,
    color: "from-sky-500 to-blue-600",
    tags: ["React", "TypeScript", "Tailwind CSS", "Next.js", "State Management", "Web Performance"],
  },
  {
    id: "AI & Data Science",
    title: "AI & Machine Learning",
    desc: "Machine Learning, LLMs, Neural Networks & Python Data Science",
    icon: Cpu,
    color: "from-emerald-500 to-teal-600",
    tags: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "LLMs", "LangChain", "Data Engineering"],
  },
  {
    id: "Fullstack Engineer",
    title: "Fullstack Mastery",
    desc: "End-to-end Web Applications from Frontend to Cloud Backend",
    icon: Layers,
    color: "from-purple-500 to-pink-600",
    tags: ["React", "Node.js", "GraphQL", "PostgreSQL", "Docker", "CI/CD", "AWS"],
  },
  {
    id: "Mobile Developer",
    title: "Mobile App Development",
    desc: "iOS & Android Cross-platform & Native App Engineering",
    icon: Smartphone,
    color: "from-amber-500 to-orange-600",
    tags: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "Mobile UI Design"],
  },
  {
    id: "DevOps & Cloud",
    title: "DevOps & Cloud Systems",
    desc: "CI/CD Pipelines, Docker, Kubernetes, AWS & Infrastructure",
    icon: Zap,
    color: "from-rose-500 to-red-600",
    tags: ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions", "Linux", "Nginx"],
  },
  {
    id: "Cybersecurity",
    title: "Cybersecurity & Defense",
    desc: "Network Security, Ethic Hacking, Vulnerability & Cryptography",
    icon: Shield,
    color: "from-cyan-500 to-slate-700",
    tags: ["Network Security", "Ethical Hacking", "Cryptography", "Penetration Testing", "OWASP"],
  },
];

const SKILL_LEVELS = [
  {
    id: "beginner",
    title: "Absolute Beginner (Level 0)",
    desc: "Starting fresh with no prior experience. We build from zero.",
    xpBadge: "+100 Welcome XP",
  },
  {
    id: "intermediate",
    title: "Intermediate Practitioner",
    desc: "Know basic syntax and core concepts. Ready for projects.",
    xpBadge: "+150 Starter XP",
  },
  {
    id: "advanced",
    title: "Advanced Mastery",
    desc: "Experienced developer aiming to master system architecture.",
    xpBadge: "+200 Boost XP",
  },
];

const TIME_COMMITMENTS = [
  { hours: 3, label: "3 Hours / Week", desc: "Casual learning pace (~30 mins / day)" },
  { hours: 7, label: "7 Hours / Week", desc: "Balanced steady growth (~1 hr / day)" },
  { hours: 15, label: "15 Hours / Week", desc: "Accelerated career sprint (~2 hrs / day)" },
];

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [selectedTags, setSelectedTags] = useState(DOMAINS[0].tags.slice(0, 4));
  const [weeklyHours, setWeeklyHours] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { completeOnboarding: completeHeaderOnboarding } = useHeaderData();
  const { user, login } = useAuth();

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setSelectedTags(domain.tags.slice(0, 4));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    const onboardingPayload = {
      targetGoal: selectedDomain.id,
      skillLevel,
      interests: selectedTags,
      weeklyHours,
      isOnboarded: true,
    };

    try {
      await api.auth.completeOnboarding(onboardingPayload);
      await api.roadmaps.generate({
        targetRole: selectedDomain.id,
        skillLevel,
        durationWeeks: 8,
      }).catch(() => {});
    } catch (err) {
      console.warn("Offline onboarding fallback activated:", err.message);
    } finally {
      completeHeaderOnboarding(onboardingPayload);
      setIsSubmitting(false);
      if (onComplete) onComplete(onboardingPayload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl transition-all">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 px-6 py-6 text-white sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20 border border-violet-400/30">
                <Brain className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Personalize Your Path</h2>
                <p className="text-xs text-slate-300">Set your starting goal, interest tags & experience level</p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-violet-200">
              Step {step} of 4
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-sky-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-h-[70vh]">
          {/* STEP 1: Select Domain */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Step 1</span>
                <h3 className="text-2xl font-bold text-gray-900">What is your target career focus?</h3>
                <p className="text-sm text-gray-500">
                  Select the domain you want to master starting from zero.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DOMAINS.map((domain) => {
                  const Icon = domain.icon;
                  const isSelected = selectedDomain.id === domain.id;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => handleDomainSelect(domain)}
                      className={`flex text-left items-start gap-4 rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? "border-violet-600 bg-violet-50/50 shadow-sm ring-1 ring-violet-600"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white bg-gradient-to-br ${domain.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900">{domain.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500 leading-snug">{domain.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Experience / Skill Level */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Step 2</span>
                <h3 className="text-2xl font-bold text-gray-900">What is your current starting level?</h3>
                <p className="text-sm text-gray-500">
                  We customize the difficulty so you start right from where you are.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {SKILL_LEVELS.map((lvl) => {
                  const isSelected = skillLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setSkillLevel(lvl.id)}
                      className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-all ${
                        isSelected
                          ? "border-violet-600 bg-violet-50/50 shadow-sm ring-1 ring-violet-600"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className="text-base font-bold text-gray-900">{lvl.title}</p>
                        <p className="mt-1 text-xs text-gray-500">{lvl.desc}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                        {lvl.xpBadge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Sub-interests & Specific Tech */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Step 3</span>
                <h3 className="text-2xl font-bold text-gray-900">Select topics you want to learn</h3>
                <p className="text-sm text-gray-500">
                  Pick key topics for {selectedDomain.title}. We'll recommend modules tailored to these choices.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {selectedDomain.tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all border ${
                        isSelected
                          ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-4 w-4" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Time Commitment & Summary Preview */}
          {step === 4 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Step 4</span>
                <h3 className="text-2xl font-bold text-gray-900">Set weekly time commitment</h3>
                <p className="text-sm text-gray-500">
                  Choose how much time you can dedicate each week.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
                {TIME_COMMITMENTS.map((tc) => {
                  const isSelected = weeklyHours === tc.hours;
                  return (
                    <button
                      key={tc.hours}
                      onClick={() => setWeeklyHours(tc.hours)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                        isSelected
                          ? "border-violet-600 bg-violet-50/50 shadow-sm ring-1 ring-violet-600"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <Clock className={`h-6 w-6 mb-2 ${isSelected ? "text-violet-600" : "text-gray-400"}`} />
                      <p className="font-bold text-gray-900">{tc.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{tc.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Summary Card Preview */}
              <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
                <div className="flex items-center gap-2 text-violet-800 font-bold text-sm mb-2">
                  <Sparkles className="h-4 w-4 text-violet-600" />
                  Your Personalized Setup Ready:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 sm:grid-cols-4">
                  <div>
                    <span className="text-gray-400 block">Target Goal</span>
                    <strong className="text-gray-900">{selectedDomain.id}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Starting Level</span>
                    <strong className="text-gray-900 uppercase">{skillLevel}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Topics Selected</span>
                    <strong className="text-gray-900">{selectedTags.length} Topics</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Starting XP</span>
                    <strong className="text-violet-600">0 XP (Level 1)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:px-8">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-700 transition-all active:scale-98"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all active:scale-98"
            >
              <Sparkles className="h-4 w-4" />
              Start Learning Path
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
