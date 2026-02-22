import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import StudentLogin from "./pages/StudentLogin";
import AlumniLogin from "./pages/AlumniLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AlumniDashboard from "./pages/AlumniDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/alumni-login" element={<AlumniLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;