import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black shadow-lg border-b-2 border-yellow-500">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition duration-300"
        >
          Taskly
        </Link>

        <div className="space-x-6 text-sm font-medium">
          <Link
            to="/"
            className="text-yellow-100 hover:text-yellow-400 transition duration-300 hover:underline"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-yellow-100 hover:text-yellow-400 transition duration-300 hover:underline"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-black bg-yellow-400 hover:bg-yellow-500 px-4 py-1.5 rounded-md transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
