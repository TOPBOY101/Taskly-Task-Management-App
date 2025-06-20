import React, { useEffect, useState } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description?: string;
  deadline?: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/tasks",
      { title, description, deadline },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    setDescription("");
    setDeadline("");
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <form onSubmit={handleAddTask} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </form>

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-sm text-gray-600">
                {task.status} | Due: {task.deadline?.substring(0, 10)}
              </p>
            </div>
            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
