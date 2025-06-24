import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-extrabold text-red-600">404</h1>
        <p className="text-2xl font-semibold text-gray-300">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-yellow-400 hover:bg-yellow-300 transition text-white px-6 py-3 rounded-lg shadow-lg"
        >
          🔙 Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
