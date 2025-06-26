import { useEffect, useState } from "react";
import { baseUrl } from "../utility/constant";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage(false);
    setLoading(true);
    if (!firstName || !lastName || !email || !password || !confrimPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (password !== confrimPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be greater than 8 characters");
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${baseUrl}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });
      setMessage(true);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white dark:bg-black text-black dark:text-yellow-100">
        Your dark mode content
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen bg-black">
        <div className="w-full bg-gray-900 rounded-lg shadow border border-yellow-400 md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-2xl font-extrabold leading-tight tracking-tight text-yellow-400 text-center">
              Create an Account
            </p>
            <div>
              <label className="block mb-2 text-sm font-medium text-yellow-300">
                First Name
              </label>
              <input
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-black border border-yellow-300 text-white placeholder-yellow-200 sm:text-sm rounded-lg block w-full p-2.5"
                type="text"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-yellow-300">
                Last Name
              </label>
              <input
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="bg-black border border-yellow-300 text-white placeholder-yellow-200 sm:text-sm rounded-lg block w-full p-2.5"
                type="text"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-yellow-300">
                Email
              </label>
              <input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black border border-yellow-300 text-white placeholder-yellow-200 sm:text-sm rounded-lg block w-full p-2.5"
                type="email"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-yellow-300">
                Password
              </label>
              <input
                className="bg-black border border-yellow-300 text-white placeholder-yellow-200 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-yellow-300">
                Confirm Password
              </label>
              <input
                className="bg-black border border-yellow-300 text-white placeholder-yellow-200 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="••••••••"
                value={confrimPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold rounded-lg text-sm px-5 py-2.5 text-black"
              type="submit"
              disabled={loading}
            >
              Create an Account
            </button>

            {message && (
              <p className="text-green-400 text-sm">
                User created successfully. Click{" "}
                <Link to={"/login"} className="underline text-yellow-300">
                  here
                </Link>{" "}
                to login.
              </p>
            )}

            <p className="text-gray-200 text-center text-sm">
              Already have an account?{" "}
              <Link to={"/"} className="text-yellow-300 underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
