import { useEffect, useState } from "react";
import api from "../utility/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;

  title: string;
  description: string;
  deadline?: string;
  state: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string | "all">("all");

  const fetchTask = async () => {
    try {
      const res = await api.get("/task/all-tasks");
      setTasks(res.data.tasks);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Error fetching tasks.");
      }
    }
  };

  const handleAddTask = async () => {
    try {
      await api.post("/task/add-task", { title, description, deadline });
      setTitle("");
      setDescription("");
      setDeadline("");
      await fetchTask();
      setIsModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Could not add task.");
      }
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      await api.put(`/task/update-task/${id}`);
      fetchTask();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message);
      }
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/task/delete-task/${id}`);
      fetchTask();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      fetchTask();
    }
  }, [navigate]);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.state === filter);
  console.log(deadline);

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 shadow-2xl p-8 border-r border-gray-800 rounded-r-3xl">
        <h1 className="flex items-center gap-3 text-3xl font-black text-yellow-400 tracking-wide mb-10">
          <img src="/favicon.png" alt="Taskly Logo" className="h-10 w-10" />
          Taskly
        </h1>
        <nav className="space-y-6">
          <a
            href="#"
            className="block text-gray-300 hover:text-indigo-400 font-medium text-lg transition duration-200"
          >
            📝 Tasks
          </a>
        </nav>
        <p
          onClick={logout}
          className="mt-12 text-sm cursor-pointer text-red-400 hover:underline"
        >
          🚪 Logout
        </p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto bg-black rounded-l-3xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white hover:text-indigo-400 transition-colors duration-200">
            Dashboard
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition duration-200"
          >
            + Add Task
          </button>
        </div>

        {error && (
          <p className="text-red-400 mb-6 text-md font-semibold">{error}</p>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition ${
              filter === "all" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            🔁 All
          </button>
          <button
            onClick={() => setFilter("ongoing")}
            className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition ${
              filter === "ongoing"
                ? "bg-yellow-500"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            🟡 Ongoing
          </button>
          <button
            onClick={() => setFilter("Completed")}
            className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition ${
              filter === "Completed"
                ? "bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            ✅ Completed
          </button>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    {task.description}
                  </p>
                  {task.deadline && (
                    <p className="text-xs text-yellow-400 mb-2">
                      📅 Deadline:{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      task.state === "Completed"
                        ? "bg-green-100 text-green-900"
                        : "bg-yellow-100 text-yellow-900"
                    }`}
                  >
                    {task.state}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {task.state === "ongoing" && (
                    <button
                      onClick={() => markAsCompleted(task._id)}
                      className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-xl transition"
                    >
                      ✅ Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-xl transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-black p-8 rounded-2xl w-96 shadow-2xl border border-yellow-600 animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-yellow-400 text-center">
              New Task
            </h3>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-4 p-3 border border-yellow-700 bg-black text-yellow-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-yellow-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full mb-4 p-3 border border-yellow-700 bg-black text-yellow-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-yellow-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="datetime-local"
              placeholder="Deadline"
              className="w-full mb-6 p-3 border border-yellow-700 bg-black text-yellow-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-yellow-500"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-800 text-yellow-100 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
