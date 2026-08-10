import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, User, Mail, Lock, Target, UserPlus, AlertCircle } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetGoal, setTargetGoal] = useState("Backend Developer");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password, targetGoal);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-500">Start your personalized learning path with PathAI</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-sm text-rose-600 border border-rose-100">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Chen"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Target Goal
            </label>
            <div className="relative">
              <Target className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <select
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all bg-white"
              >
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Fullstack Engineer">Fullstack Engineer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-xs hover:bg-violet-700 disabled:opacity-50 transition-all active:scale-98"
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
