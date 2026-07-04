import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
      : "hover:text-blue-600 transition";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl gradient-btn flex items-center justify-center text-white shadow-md">
            <BriefcaseBusiness size={23} />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black leading-none">
              PrepGenius
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Career Platform
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/resume-analyzer" className={linkClass("/resume-analyzer")}>
            Resume Analyzer
          </Link>

          <Link to="/mock-interview" className={linkClass("/mock-interview")}>
            Mock Interview
          </Link>

          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="hidden xl:inline-flex items-center gap-2 text-sm text-slate-600 bg-green-50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Placement Ready
          </span>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-600 transition shadow-md"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="gradient-btn text-white px-5 py-2 rounded-xl font-bold shadow-md hover:shadow-xl transition"
            >
              Sign In
            </Link>
          )}
        </div>

        <div className="md:hidden">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-md text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="gradient-btn text-white px-4 py-2 rounded-xl font-bold shadow-md text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="lg:hidden px-5 pb-4 grid grid-cols-2 gap-3 text-sm font-medium text-center text-slate-600">
        <Link to="/" className={linkClass("/")}>
          Home
        </Link>

        <Link to="/resume-analyzer" className={linkClass("/resume-analyzer")}>
          Resume
        </Link>

        <Link to="/mock-interview" className={linkClass("/mock-interview")}>
          Interview
        </Link>

        <Link to="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
