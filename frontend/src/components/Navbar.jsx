import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

function Navbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl gradient-btn flex items-center justify-center text-white">
            <BrainCircuit size={22} />
          </div>
          <span className="text-2xl font-black">
            PrepGenius <span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7 font-medium text-slate-600">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>

          <Link
            to="/login"
            className="gradient-btn text-white px-5 py-2 rounded-xl shadow-lg"
          >
            {isLoggedIn ? "Account" : "Login"}
          </Link>
        </div>

        <Link
          to="/login"
          className="md:hidden gradient-btn text-white px-5 py-2 rounded-xl font-bold shadow-lg"
        >
          {isLoggedIn ? "Account" : "Login"}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
