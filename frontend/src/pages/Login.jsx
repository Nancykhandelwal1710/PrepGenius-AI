import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
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
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await signInWithPopup(auth, provider);
      saveLoginAndRedirect();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="soft-card w-full max-w-md rounded-3xl p-8">
        <h1 className="text-4xl font-black text-center mb-2">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-center text-slate-500 mb-8">
          {isRegister
            ? "Create your PrepGenius account."
            : "Login to continue your career preparation journey."}
        </p>

        {error && (
          <div className="mb-5 bg-red-100 text-red-700 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-4 outline-none"
          />

          <button
            type="button"
            onClick={handleEmailAuth}
            className="w-full gradient-btn text-white py-4 rounded-xl font-bold"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold"
          >
            Continue with Google
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          {isRegister ? "Already have an account?" : "New to PrepGenius?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 font-bold"
          >
            {isRegister ? "Login" : "Create account"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
