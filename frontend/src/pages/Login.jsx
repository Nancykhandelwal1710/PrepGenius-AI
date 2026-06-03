import { useLocation, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/dashboard";

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="soft-card w-full max-w-md rounded-3xl p-8">
        <h1 className="text-4xl font-black text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-slate-500 mb-8">
          Login to continue your career preparation journey.
        </p>

        <form className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-slate-200 rounded-xl p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-slate-200 rounded-xl p-4 outline-none"
          />

          <button
            type="button"
            onClick={handleLogin}
            className="w-full gradient-btn text-white py-4 rounded-xl font-bold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
