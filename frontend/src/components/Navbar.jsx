import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

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

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-xl shadow-lg font-bold"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="gradient-btn text-white px-5 py-2 rounded-xl shadow-lg"
            >
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold shadow-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="gradient-btn text-white px-5 py-2 rounded-xl font-bold shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
