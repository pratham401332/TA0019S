import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/30 sticky top-0 z-50">

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-gray-800 cursor-pointer"
      >
        Warm<span className="text-teal-600">Connect</span>
      </h1>

      {/* Navigation Links */}
      <div className="space-x-6 text-gray-700 font-medium hidden md:flex items-center">

        <button
          onClick={() => navigate("/")}
          className="hover:text-teal-600 transition"
        >
          Students
        </button>

        <button
          onClick={() => navigate("/")}
          className="hover:text-teal-600 transition"
        >
          Alumni
        </button>

        <button
          onClick={() => navigate("/select-role")}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
        >
          Login
        </button>

      </div>
    </div>
  );
}