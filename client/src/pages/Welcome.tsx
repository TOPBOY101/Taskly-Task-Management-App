import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

const Welcome = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-yellow-100 px-6">
        <div className="max-w-2xl text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 mb-6">
            Welcome to Taskly
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Organize your day, manage your time, and get things done
            effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg shadow-md transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-transparent border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
