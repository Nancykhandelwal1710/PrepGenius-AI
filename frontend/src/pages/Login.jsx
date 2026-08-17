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
    <div className="min-h-screen bg-[#FBFAF6] text-[#14213D] px-4 py-8 md:py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">

        {/* Brand side */}
        <section className="relative overflow-hidden bg-[#2457D6] text-white border-2 border-[#14213D] shadow-[8px_8px_0_#14213D] p-7 md:p-10 min-h-[620px] flex flex-col">
          <div className="absolute -right-10 -top-16 text-[16rem] leading-none font-black text-white/8">
            ✦
          </div>
          <div className="absolute -bottom-10 -left-10 text-[10rem] leading-none font-black text-[#B8E34B]/15">
            +
          </div>

          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 bg-white flex items-center justify-center overflow-hidden border-2 border-[#14213D]">
                <img
                  src="/prepgenius_logo_new.jpg"
                  alt="PrepGenius"
                  className="w-[60px] max-w-none"
                />
              </div>

              <div>
                <p className="font-black text-xl leading-none">
                  <span className="text-white">Prep</span>
                  <span className="text-[#B8E34B]">Genius</span>
                </p>
                <p className="text-xs text-white/55 mt-1">
                  Prep • Learn • Grow
                </p>
              </div>
            </div>

            <p className="mt-12 text-sm uppercase tracking-[0.18em] font-black text-[#B8E34B]">
              {isRegister ? "Start your journey" : "Welcome back"}
            </p>

            <h1 className="mt-3 text-4xl md:text-6xl font-black tracking-[-0.055em] leading-[0.92] max-w-xl">
              Prepare smarter.
              <br />
              <span className="font-serif italic font-normal text-[#B8E34B]">
                Feel ready.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-white/70 text-base md:text-lg leading-8">
              Your resume, skills and interview practice — all in one place,
              built to help you feel more prepared before you apply.
            </p>
          </div>

          <div className="relative mt-auto pt-10 grid sm:grid-cols-2 gap-3">
            {[
              [FileText, "Resume fit", "See what your resume is missing."],
              [CheckCircle, "Skill gaps", "Know what to work on next."],
              [Mic, "Interview practice", "Practice before the real thing."],
              [BarChart3, "Your progress", "Keep an eye on your preparation."],
            ].map(([Icon, title, desc]) => (
              <div
                key={title}
                className="bg-white/10 border border-white/10 p-4 hover:bg-white/15 transition-colors"
              >
                <Icon size={21} className="text-[#B8E34B] mb-3" />
                <h3 className="font-black">{title}</h3>
                <p className="text-xs text-white/50 leading-5 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Auth side */}
        <section className="bg-white border-2 border-[#14213D]/10 p-7 md:p-10 flex items-center">
          <div className="w-full max-w-md mx-auto">

            <div className="mb-8">
              <p className="text-sm font-serif italic text-[#2457D6]">
                {isRegister ? "Create your account" : "Good to see you"}
              </p>

              <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-[-0.04em]">
                {isRegister ? "Let's get you started." : "Continue your preparation."}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#14213D]/50">
                {isRegister
                  ? "Create an account and start building your preparation workspace."
                  : "Sign in to pick up where you left off."}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-[#FFF0EC] border-2 border-[#FF6B57]/30 text-[#9F3326] p-4 text-sm leading-6">
                {error}
              </div>
            )}

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-black mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-[#14213D]/10 bg-[#FBFAF6] px-4 py-3.5 outline-none focus:border-[#2457D6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-black mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-[#14213D]/10 bg-[#FBFAF6] px-4 py-3.5 outline-none focus:border-[#2457D6] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={handleEmailAuth}
                className="w-full bg-[#14213D] text-white py-4 px-5 font-black hover:bg-[#2457D6] transition-colors shadow-[4px_4px_0_#B8E34B]"
              >
                {isRegister ? "Create Account →" : "Sign In →"}
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px bg-[#14213D]/10 flex-1" />
                <span className="text-xs uppercase tracking-widest text-[#14213D]/30 font-bold">
                  or
                </span>
                <div className="h-px bg-[#14213D]/10 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border-2 border-[#14213D]/15 text-[#14213D] py-3.5 px-5 font-black hover:border-[#2457D6] hover:text-[#2457D6] transition-colors"
              >
                Continue with Google
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#14213D]/10 text-center">
              <p className="text-sm text-[#14213D]/55">
                {isRegister ? "Already have an account?" : "New to PrepGenius?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[#2457D6] font-black hover:underline"
                >
                  {isRegister ? "Sign in" : "Create account"}
                </button>
              </p>

              <p className="text-xs text-[#14213D]/30 mt-5">
                Authentication powered by Firebase.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
