import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  BriefcaseBusiness,
  CheckCircle,
  FileText,
  Mic,
  BarChart3,
} from "lucide-react";
import { auth, provider } from "../firebase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const saveLoginAndRedirect = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate(redirectPath);
  };

  const handleEmailAuth = async () => {
    try {
      setError("");

      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      saveLoginAndRedirect();
    } catch (err) {
      setError("Login failed. Please check your details and try again.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await signInWithPopup(auth, provider);
      saveLoginAndRedirect();
    } catch (err) {
      setError("Google sign in failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
        <div className="bg-slate-950 text-white rounded-3xl shadow-xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-8">
              <BriefcaseBusiness size={28} />
            </div>

            <p className="text-sm uppercase tracking-widest text-blue-300 mb-3">
              PrepGenius AI
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Prepare smarter before you apply
            </h1>

            <p className="text-slate-300 leading-8 max-w-xl mb-10">
              Sign in to continue your resume analysis, interview practice, and
              preparation dashboard from one place.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                [FileText, "Resume analysis", "Check resume fit with job descriptions."],
                [CheckCircle, "Skill gap view", "Find what is missing before applying."],
                [Mic, "Interview practice", "Practice role-based questions."],
                [BarChart3, "Progress dashboard", "Track your latest preparation score."],
              ].map(([Icon, title, desc]) => (
                <div
                  key={title}
                  className="bg-white/10 border border-white/10 rounded-2xl p-5"
                >
                  <Icon className="text-blue-300 mb-4" size={24} />
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-6">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <p className="text-sm text-slate-300 leading-7">
                “Use PrepGenius as a practice space before sending your resume
                or attending interviews.”
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <p className="text-sm text-blue-600 font-semibold mb-2">
              {isRegister ? "Create your account" : "Welcome back"}
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {isRegister ? "Start your preparation" : "Continue preparation"}
            </h2>

            <p className="text-slate-600 text-sm leading-6 mb-8">
              {isRegister
                ? "Create an account to access resume analysis and mock interview practice."
                : "Login to access your dashboard, resume score, and interview practice."}
            </p>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleEmailAuth}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700"
              >
                {isRegister ? "Create Account" : "Sign In"}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-slate-300 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-50"
              >
                Sign in with Google
              </button>
            </form>

            <p className="text-center text-slate-600 mt-7 text-sm">
              {isRegister ? "Already have an account?" : "New to PrepGenius?"}{" "}
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-blue-600 font-bold"
              >
                {isRegister ? "Sign in" : "Create account"}
              </button>
            </p>

            <p className="text-center text-xs text-slate-400 mt-6">
              Authentication powered by Firebase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
