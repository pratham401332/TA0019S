import { useState } from "react";
import API from "../api/api";

export default function AlumniDashboard() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [goal, setGoal] = useState("");
  const [availability, setAvailability] = useState(1);
  const [skills, setSkills] = useState([]);

  const availableSkills = [
    "React","Java","Python","C","JavaScript","Node","MongoDB",
    "SQL","Machine Learning","DSA","Spring Boot",
    "HTML","CSS","UI/UX","Statistics"
  ];

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSubmit = async () => {
    try {
      await API.post("/alumni", {
        name,
        industry,
        goal,
        availability: Number(availability),
        skills,
      });

      alert("Profile saved to backend!");
      setName("");
      setIndustry("");
      setGoal("");
      setSkills([]);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-blue-100 p-10">
      <h1 className="text-3xl font-bold mb-8">👔 Alumni Dashboard</h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-4xl">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">Select Industry</option>
          <option value="Software Development">Software Development</option>
          <option value="Frontend Development">Frontend Development</option>
          <option value="Backend Engineering">Backend Engineering</option>
          <option value="Data Science">Data Science</option>
        </select>

        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">Select Goal</option>
          <option value="Placement">Placement</option>
          <option value="Higher Studies">Higher Studies</option>
          <option value="Startup">Startup</option>
        </select>

        <input
          type="range"
          min="1"
          max="5"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full mb-4"
        />

        <div className="flex flex-wrap gap-3 mb-6">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 rounded-full border ${
                skills.includes(skill)
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}