import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-950 text-white px-4 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-400 text-center md:text-left"
          >
            PrepGenius AI
          </Link>

          <div className="grid grid-cols-2 gap-3 text-center text-sm md:flex md:items-center md:gap-6">
            <Link to="/" className="hover:text-blue-400">
              Home
            </Link>

            <Link to="/resume-analyzer" className="hover:text-blue-400">
              Resume
            </Link>

            <Link to="/mock-interview" className="hover:text-blue-400">
              Interview
            </Link>

            <Link to="/dashboard" className="hover:text-blue-400">
              Dashboard
            </Link>

            <Link
              to="/login"
              className="col-span-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 md:col-span-1"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
