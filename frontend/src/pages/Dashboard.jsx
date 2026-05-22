import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";

export default function Dashboard() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);

  const studentData = JSON.parse(localStorage.getItem("studentData")) || [];
  const usn = localStorage.getItem("usn");
  const semester = localStorage.getItem("semester");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(
          `https://student-performance-analyzer-keuu.onrender.com/analysis/${usn}/${semester}`
        );
        setAnalysis(response.data);
      } catch (error) {
        console.log("Analysis fetch error:", error);
      }
    };

    fetchAnalysis();
  }, [usn, semester]);

  if (studentData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100">
        <div className="bg-white/40 p-10 rounded-3xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">No Student Data Found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-300 px-6 py-3 rounded-xl font-semibold"
          >
            Go Back to Login
          </button>
        </div>
      </div>
    );
  }

  const studentName = studentData[0]["Student Name"];

  const filteredSubjects = studentData.filter(
    (item) => String(item.Semester) === String(semester)
  );

  const getStatus = (percentage) => {
    if (percentage >= 85) return "Excellent";
    if (percentage >= 75) return "Strong";
    if (percentage >= 50) return "Average";
    return "Weak";
  };

  const getStatusColor = (status) => {
    if (status === "Excellent") return "bg-green-200";
    if (status === "Strong") return "bg-blue-200";
    if (status === "Average") return "bg-yellow-200";
    return "bg-red-200";
  };

  const getPredictionLabel = (scoreOutOf30) => {
    const percentage = (scoreOutOf30 / 30) * 100;

    if (percentage >= 85) return "Excellent Prediction";
    if (percentage >= 75) return "Good Prediction";
    if (percentage >= 50) return "Needs Practice";
    return "High Focus Needed";
  };

  const getPredictionColor = (scoreOutOf30) => {
    const percentage = (scoreOutOf30 / 30) * 100;

    if (percentage >= 85) return "bg-green-200";
    if (percentage >= 75) return "bg-blue-200";
    if (percentage >= 50) return "bg-yellow-200";
    return "bg-red-200";
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Student Performance Report", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Name: ${studentName}`, 20, 35);
    pdf.text(`USN: ${usn}`, 20, 45);
    pdf.text(`Semester: ${semester}`, 20, 55);

    pdf.text(`Predicted SGPA: ${analysis?.predicted_sgpa}`, 20, 70);
    pdf.text(`Performance Score: ${analysis?.predicted_score}%`, 20, 80);
    pdf.text(`Predicted Grade: ${analysis?.predicted_grade}`, 20, 90);
    pdf.text(`Strongest Subject: ${analysis?.strongest_subject}`, 20, 105);
    pdf.text(`Weakest Subject: ${analysis?.weakest_subject}`, 20, 115);

    let y = 135;
    pdf.text("Subject Details:", 20, y);
    y += 10;

    filteredSubjects.forEach((subject) => {
      const avg =
        (subject["Internal 1"] +
          subject["Internal 2"] +
          subject["Internal 3"]) /
        3;

      pdf.text(`${subject["Subject Name"]} (${subject["Subject Code"]})`, 20, y);
      y += 8;

      pdf.text(
        `I1: ${subject["Internal 1"]}/30, I2: ${subject["Internal 2"]}/30, I3: ${subject["Internal 3"]}/30, Avg: ${avg.toFixed(1)}/30`,
        25,
        y
      );

      y += 12;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });

    pdf.save(`${usn || "student"}_performance_report.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {studentName} 👋
        </h1>

        <p className="text-gray-600">
          USN: {usn} | Semester: {semester}
        </p>
      </div>

      <button
        onClick={downloadPDF}
        className="mb-8 bg-gradient-to-r from-pink-300 to-blue-300 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
      >
        Download PDF Report
      </button>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Predicted SGPA</h2>
          <p className="text-4xl font-bold">
            {analysis ? analysis.predicted_sgpa : "Loading..."}
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Performance Score</h2>
          <p className="text-4xl font-bold">
            {analysis ? `${analysis.predicted_score}%` : "Loading..."}
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Strongest Subject</h2>
          <p className="text-xl font-bold">
            {analysis ? analysis.strongest_subject : "Loading..."}
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Weakest Subject</h2>
          <p className="text-xl font-bold">
            {analysis ? analysis.weakest_subject : "Loading..."}
          </p>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl mb-10">
        <h2 className="text-2xl font-bold mb-3">
          Mathematical Analysis 🧮
        </h2>

        <p className="text-gray-700 leading-relaxed">
          Internal marks are calculated out of 30. Average, variance, standard
          deviation, and future prediction use raw /30 marks. Performance Score
          is normalized to 100 using internal marks and assignment score only.
        </p>

        <p className="mt-3 font-semibold">
          Predicted Grade: {analysis ? analysis.predicted_grade : "Loading..."}
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6">Future Score Prediction 📈</h2>

      <div className="grid grid-cols-2 gap-6 mb-10">
        {analysis &&
          analysis.future_predictions.map((item, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-2">{item.subject}</h3>

              <p className="text-gray-600 mb-4">{item.subject_code}</p>

              <p className="text-lg">Predicted Future Score:</p>

              <p className="text-4xl font-bold mt-2">
                {item.predicted_future_score}/30
              </p>

              <div className="mt-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getPredictionColor(
                    item.predicted_future_score
                  )}`}
                >
                  {getPredictionLabel(item.predicted_future_score)}
                </span>
              </div>
            </div>
          ))}
      </div>

      <h2 className="text-3xl font-bold mb-6">Consistency Analysis 📊</h2>

      <div className="grid grid-cols-2 gap-6 mb-10">
        {analysis &&
          analysis.consistency_analysis.map((item, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-2">{item.subject}</h3>

              <p className="text-gray-600 mb-4">{item.subject_code}</p>

              <p className="mb-2">
                Variance: <span className="font-bold">{item.variance}</span>
              </p>

              <p className="mb-4">
                Standard Deviation:{" "}
                <span className="font-bold">{item.standard_deviation}</span>
              </p>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  item.consistency_level === "Highly Consistent"
                    ? "bg-green-200"
                    : item.consistency_level === "Moderately Consistent"
                    ? "bg-yellow-200"
                    : "bg-red-200"
                }`}
              >
                {item.consistency_level}
              </span>
            </div>
          ))}
      </div>

      <h2 className="text-3xl font-bold mb-6">Your Subjects</h2>

      <div className="grid grid-cols-2 gap-6">
        {filteredSubjects.map((subject, index) => {
          const average =
            (subject["Internal 1"] +
              subject["Internal 2"] +
              subject["Internal 3"]) /
            3;

          const averagePercentage = (average / 30) * 100;
          const status = getStatus(averagePercentage);

          return (
            <div
              key={index}
              onClick={() => navigate(`/subject/${index}`)}
              className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl hover:scale-105 cursor-pointer transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-2">
                {subject["Subject Name"]}
              </h3>

              <p className="text-gray-600 mb-3">
                {subject["Subject Code"]}
              </p>

              <p className="mb-2">Internal 1: {subject["Internal 1"]}/30</p>
              <p className="mb-2">Internal 2: {subject["Internal 2"]}/30</p>
              <p className="mb-4">Internal 3: {subject["Internal 3"]}/30</p>

              <div className="flex justify-between items-center">
                <p className="font-semibold">Avg: {average.toFixed(1)}/30</p>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}