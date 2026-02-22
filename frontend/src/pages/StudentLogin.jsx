import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-blue-100 flex items-center justify-center">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Student Login
        </h2>

        <input
          type="email"
          placeholder="College Email"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          onClick={() => navigate("/student-dashboard")}
          className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}