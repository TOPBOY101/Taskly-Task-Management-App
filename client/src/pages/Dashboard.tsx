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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-yellow-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-zinc-900 shadow-2xl p-6 md:p-8 border-r border-yellow-600 rounded-b-3xl md:rounded-none md:rounded-r-3xl">
        <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-black text-yellow-400 tracking-wide mb-8 md:mb-10">
          <img src="/favicon.png" alt="Taskly Logo" className="h-10 w-10" />
          Taskly
        </h1>
        <nav className="space-y-4">
          <a
            href="#"
            className="block text-yellow-300 hover:text-yellow-500 font-medium text-lg transition duration-200"
          >
            📝 Tasks
          </a>
        </nav>
        <p
          onClick={logout}
          className="mt-10 md:mt-12 text-sm cursor-pointer text-red-500 hover:underline"
        >
          🚪 Logout
        </p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto bg-black rounded-t-3xl md:rounded-none md:rounded-l-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-100 hover:text-yellow-400 transition-colors duration-200">
            Dashboard
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-500 text-black px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-md hover:bg-yellow-600 transition duration-200"
          >
            + Add Task
          </button>
        </div>

        {error && (
          <p className="text-red-400 mb-6 text-sm md:text-md font-semibold">
            {error}
          </p>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-semibold text-black shadow-lg transition ${
              filter === "all"
                ? "bg-yellow-400"
                : "bg-yellow-300 hover:bg-yellow-400"
            }`}
          >
            🔁 All
          </button>
          <button
            onClick={() => setFilter("ongoing")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-semibold text-black shadow-lg transition ${
              filter === "ongoing"
                ? "bg-yellow-500"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            🟡 Ongoing
          </button>
          <button
            onClick={() => setFilter("Completed")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-semibold text-black shadow-lg transition ${
              filter === "Completed"
                ? "bg-green-400"
                : "bg-green-300 hover:bg-green-400"
            }`}
          >
            ✅ Completed
          </button>
        </div>

        {/* Task List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-zinc-800 p-6 rounded-2xl shadow-lg border border-yellow-600 hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-yellow-200 mb-1">
                    {task.title}
                  </h3>
                  <p className="text-sm text-yellow-100 mb-2">
                    {task.description}
                  </p>
                  {task.deadline && (
                    <p className="text-xs text-yellow-300 mb-2">
                      📅 Deadline:{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  )}
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      task.state === "Completed"
                        ? "bg-green-200 text-green-900"
                        : "bg-yellow-200 text-yellow-900"
                    }`}
                  >
                    {task.state}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {task.state === "ongoing" && (
                    <button
                      onClick={() => markAsCompleted(task._id)}
                      className="text-sm bg-green-500 hover:bg-green-600 text-black px-4 py-1 rounded-xl transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 sm:p-6">
          <div className="bg-zinc-900 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl border border-yellow-600 animate-fade-in">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-yellow-400 text-center">
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
                className="px-4 py-2 bg-zinc-800 text-yellow-100 rounded-lg hover:bg-zinc-700 transition"
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
