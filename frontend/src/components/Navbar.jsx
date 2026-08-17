import { Link, useLocation, useNavigate } from "react-router-dom";
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
      ? "text-[#2457D6] font-black border-b-2 border-[#2457D6] pb-1"
      : "hover:text-[#2457D6] transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-[#FBFAF6]/95 backdrop-blur-xl border-b-2 border-[#14213D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3.5 flex items-center justify-between gap-5">

        {/* Brand */}
        <Link to="/" className="flex items-center shrink-0 group">
          <div className="relative w-13 h-11 overflow-hidden flex-shrink-0 border- border-[#14213D] bg-white group-hover:border-[#2457D6] transition-colors">
            <img
              src="/prepgenius_logo_new.jpg"
              alt="PrepGenius Logo"
              className="absolute w-[82px] max-w-none left-[-18px] top-[-13px]"
            />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-black leading-none tracking-[-0.04em]">
              <span className="text-[#14213D]">Prep</span>
              <span className="text-[#2457D6]">Genius</span>
            </h1>
            <p className="text-[10px] md:text-xs mt-1 font-bold tracking-wide">
              <span className="text-[#14213D]/100">Prep • </span>
              <span className="text-[#B8E34B]/100">Learn • </span>
              <span className="text-[#2457D6]">Grow</span>
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-[#14213D]/60">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/resume-analyzer" className={linkClass("/resume-analyzer")}>
            Resume Analyzer
          </Link>

          <Link to="/resume-builder" className={linkClass("/resume-builder")}>
            Resume Builder
          </Link>

          <Link to="/mock-interview" className={linkClass("/mock-interview")}>
            Mock Interview
          </Link>

          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
        </div>

        {/* Desktop action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span className="hidden xl:inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#526B00] bg-[#F1F7D9] border border-[#B8E34B]/60 px-3 py-2">
            <span className="w-2 h-2 bg-[#B8E34B] rounded-full"></span>
            Placement Ready
          </span>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-[#14213D] text-white px-4 py-2.5 font-black hover:bg-[#2457D6] transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#2457D6] text-white px-4 py-2.5 font-black hover:bg-[#14213D] transition-colors shadow-[3px_3px_0_#B8E34B]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile action */}
        <div className="md:hidden shrink-0">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-[#14213D] text-white px-3.5 py-2 font-black text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#2457D6] text-white px-3.5 py-2 font-black text-sm shadow-[2px_2px_0_#B8E34B]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden border-t border-[#14213D]/10 px-3 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs sm:text-sm font-bold text-center">
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>

          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/resume-analyzer" className={linkClass("/resume-analyzer")}>
            Resume Analyzer
          </Link>

          <Link to="/resume-builder" className={linkClass("/resume-builder")}>
            Resume Builder
          </Link>

          <Link to="/resume-optimizer" className={linkClass("/resume-optimizer")}>
            Resume Optimizer
          </Link>

          <Link to="/mock-interview" className={linkClass("/mock-interview")}>
            Mock Interview
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
