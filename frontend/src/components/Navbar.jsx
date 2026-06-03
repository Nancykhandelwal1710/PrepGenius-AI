import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
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
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/resume-analyzer" className="hover:text-indigo-600">Resume</Link>
          <Link to="/mock-interview" className="hover:text-indigo-600">Interview</Link>
          <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
          <Link
            to="/login"
            className="gradient-btn text-white px-5 py-2 rounded-xl shadow-lg"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
