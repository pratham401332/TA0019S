import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-blue-100 flex flex-col items-center justify-center">

      <h2 className="text-4xl font-bold mb-10 text-gray-800">
        Login As
      </h2>

      <div className="flex gap-10">
        <button
          onClick={() => navigate("/student-login")}
          className="bg-white shadow-xl rounded-2xl px-10 py-8 hover:scale-105 transition"
        >
          🎓 Student
        </button>

        <button
          onClick={() => navigate("/alumni-login")}
          className="bg-white shadow-xl rounded-2xl px-10 py-8 hover:scale-105 transition"
        >
          👔 Alumni
        </button>
      </div>
    </div>
  );
}