import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utility/constant";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen bg-black">
          <div className="w-full bg-gray-900 rounded-lg shadow border border-yellow-400 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <p className="text-2xl font-bold leading-tight tracking-tight text-yellow-400 text-center">
                Log Into Your Account
              </p>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-yellow-300"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black border border-yellow-300 text-white placeholder-yellow-200 sm:text-sm rounded-lg block w-full p-2.5"
                  id="email"
                  type="email"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-yellow-300">
                  Password
                </label>
                <div className="bg-black border border-yellow-300 text-white placeholder-yellow-200 sm:text-sm rounded-lg flex gap-2 w-full p-2.5">
                  <input
                    className="outline-none bg-transparent w-full text-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={showPassword ? "text" : "password"}
                  />
                  <p
                    className="text-yellow-300 text-xs cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </p>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold rounded-lg text-sm px-5 py-2.5 text-black"
                type="submit"
                disabled={loading}
              >
                Log In
              </button>

              <p className="text-gray-200 text-center text-sm">
                Don't have an account?{" "}
                <Link to={"/register"} className="text-yellow-300 underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
