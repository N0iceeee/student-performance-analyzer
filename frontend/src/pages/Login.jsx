import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [usn, setUsn] = useState("");
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (usn.length !== 10) {
      setError("Invalid USN");
      return;
    }

    if (semester === "") {
      setError("Please select semester");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:9000/student/${usn}`
      );

      if (response.data.length === 0) {
        setError("USN not found in database");
        return;
      }

      localStorage.setItem("studentData", JSON.stringify(response.data));
      localStorage.setItem("usn", usn);
      localStorage.setItem("semester", semester);

      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError("Backend server not connected");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden relative">
      <div className="absolute w-72 h-72 bg-pink-300 opacity-40 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>

      <div className="absolute w-72 h-72 bg-blue-300 opacity-40 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>

      <div className="relative z-10 bg-white/30 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-10 w-[420px]">
        <h1 className="text-3xl font-bold text-center mb-2">
          Student Performance Analyzer
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Smart Academic Insights 📊
        </p>

        <input
          type="text"
          placeholder="Enter USN"
          value={usn}
          onChange={(e) => setUsn(e.target.value.toUpperCase())}
          className={`w-full p-3 rounded-xl mb-4 bg-white/60 outline-none border-2 transition-all ${
            error === "Invalid USN" || error === "USN not found in database"
              ? "border-red-500"
              : "border-transparent"
          }`}
        />

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full p-3 rounded-xl mb-4 bg-white/60 outline-none"
        >
          <option value="">Select Semester</option>

          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-pink-300 to-blue-300 hover:scale-105 transition-all duration-300 p-3 rounded-xl font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}