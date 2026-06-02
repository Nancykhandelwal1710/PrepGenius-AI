import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-950 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-400">
          PrepGenius AI
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-400">
            Home
          </Link>

          <Link to="/resume-analyzer" className="hover:text-blue-400">
            Resume Analyzer
          </Link>

          <Link to="/mock-interview" className="hover:text-blue-400">
            Mock Interview
          </Link>

          <Link to="/dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>

          <Link
            to="/login"
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
