import { useState } from "react";
import API from "../api/api";

export default function StudentDashboard() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [careerGoal, setCareerGoal] = useState("");
  const [preferredIndustry, setPreferredIndustry] = useState("");
  const [matches, setMatches] = useState([]);

  const availableSkills = [
    "React","Java","Python","C","JavaScript","Node","MongoDB",
    "SQL","Machine Learning","DSA","Spring Boot",
    "HTML","CSS","UI/UX","Statistics"
  ];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const calculateMatches = async () => {
    try {
      const res = await API.get("/alumni");
      const alumniList = res.data;

      const results = alumniList.map((alumni) => {
        const commonSkills = selectedSkills.filter((skill) =>
          alumni.skills.includes(skill)
        );

        const skillScore =
          (commonSkills.length / alumni.skills.length) * 50;

        const industryScore =
          preferredIndustry === alumni.industry ? 20 : 0;

        const goalScore =
          careerGoal === alumni.goal ? 20 : 0;

        const availabilityScore = (alumni.availability / 5) * 10;

        const totalScore = Math.round(
          skillScore + industryScore + goalScore + availabilityScore
        );

        return {
          ...alumni,
          compatibility: totalScore,
        };
      });

      results.sort((a, b) => b.compatibility - a.compatibility);
      setMatches(results);

    } catch (error) {
      console.error(error);
      alert("Error fetching alumni from backend");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-blue-100 p-10">
      <h1 className="text-3xl font-bold mb-8">
        🎓 Smart Compatibility Engine
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-4xl">
        <div className="flex flex-wrap gap-3 mb-6">
          {availableSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 rounded-full border ${
                selectedSkills.includes(skill)
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        <select
          value={preferredIndustry}
          onChange={(e) => setPreferredIndustry(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">Select Preferred Industry</option>
          <option value="Software Development">Software Development</option>
          <option value="Frontend Development">Frontend Development</option>
          <option value="Backend Engineering">Backend Engineering</option>
          <option value="Data Science">Data Science</option>
        </select>

        <select
          value={careerGoal}
          onChange={(e) => setCareerGoal(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="">Select Career Goal</option>
          <option value="Placement">Placement</option>
          <option value="Higher Studies">Higher Studies</option>
          <option value="Startup">Startup</option>
        </select>

        <button
          onClick={calculateMatches}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg mb-6"
        >
          Find Best Matches
        </button>

        {matches.map((alumni, index) => (
          <div key={index} className="bg-gray-50 shadow-md rounded-xl p-4 mb-4">
            <h3 className="font-bold text-lg">👔 {alumni.name}</h3>
            <p className="text-sm">Industry: {alumni.industry}</p>
            <p className="text-sm">Goal: {alumni.goal}</p>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-teal-500 h-3 rounded-full"
                style={{ width: `${alumni.compatibility}%` }}
              ></div>
            </div>

            <p className="mt-1 font-semibold text-teal-600">
              Compatibility: {alumni.compatibility}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}