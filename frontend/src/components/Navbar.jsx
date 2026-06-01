import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center gap-6">
        <Link to="/" className="font-semibold text-gray-800 hover:text-blue-600">
          Home
        </Link>

        <Link to="/login" className="font-semibold text-gray-800 hover:text-blue-600">
          Login
        </Link>

        <Link to="/dashboard" className="font-semibold text-gray-800 hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/resume-analyzer" className="font-semibold text-gray-800 hover:text-blue-600">
          Resume Analyzer
        </Link>

        <Link to="/mock-interview" className="font-semibold text-gray-800 hover:text-blue-600">
          Mock Interview
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
