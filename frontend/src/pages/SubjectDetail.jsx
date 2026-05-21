import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function SubjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const studentData =
    JSON.parse(localStorage.getItem("studentData")) || [];

  const semester = localStorage.getItem("semester");

  const filteredSubjects = studentData.filter(
    (item) => String(item.Semester) === String(semester)
  );

  const subject = filteredSubjects[Number(id)];

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100">
        <div className="bg-white/40 p-10 rounded-3xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-4">
            Subject Not Found
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-pink-300 px-6 py-3 rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const marksData = [
    {
      exam: "Internal 1",
      marks: subject["Internal 1"],
    },
    {
      exam: "Internal 2",
      marks: subject["Internal 2"],
    },
    {
      exam: "Internal 3",
      marks: subject["Internal 3"],
    },
  ];

  const average =
    (subject["Internal 1"] +
      subject["Internal 2"] +
      subject["Internal 3"]) /
    3;

  const highest = Math.max(
    subject["Internal 1"],
    subject["Internal 2"],
    subject["Internal 3"]
  );

  const lowest = Math.min(
    subject["Internal 1"],
    subject["Internal 2"],
    subject["Internal 3"]
  );

  const improvement =
    subject["Internal 3"] - subject["Internal 1"];

  let aiFeedback = "";

  if (improvement > 10) {
    aiFeedback =
      "You are improving strongly in this subject. Keep following the same study pattern and revise regularly.";
  } else if (improvement > 0) {
    aiFeedback =
      "You are improving steadily. Try to increase consistency and practice more previous question papers.";
  } else if (improvement === 0) {
    aiFeedback =
      "Your performance is stable. To improve further, focus on weak topics and attempt more practice problems.";
  } else {
    aiFeedback =
      "Your performance has dropped. Focus on revision, basics, and solving important problems from each module.";
  }

  let focusArea = "";

  if (average >= 85) {
    focusArea = "Maintain consistency and aim for university-level high scoring answers.";
  } else if (average >= 70) {
    focusArea = "Focus on improving accuracy and writing more complete answers.";
  } else if (average >= 55) {
    focusArea = "Revise core concepts and practice medium-level problems daily.";
  } else {
    focusArea = "Start from basics, revise class notes, and solve repeated exam questions.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 p-10">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-white/50 px-5 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        ← Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {subject["Subject Name"]} 📊
        </h1>

        <p className="text-gray-600">
          Code: {subject["Subject Code"]} | Grade: {subject["Overall Grade"]}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="font-semibold mb-2">Average</h2>
          <p className="text-4xl font-bold">{average.toFixed(1)}%</p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="font-semibold mb-2">Highest</h2>
          <p className="text-4xl font-bold">{highest}</p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="font-semibold mb-2">Lowest</h2>
          <p className="text-4xl font-bold">{lowest}</p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="font-semibold mb-2">Attendance</h2>
          <p className="text-4xl font-bold">
            {subject["Attendance %"]}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">
            Marks Progression
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marksData}>
              <XAxis dataKey="exam" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="marks"
                stroke="#ff69b4"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">
            Internal Comparison
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marksData}>
              <XAxis dataKey="exam" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#93c5fd" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-3">
            AI Analysis 🧠
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {aiFeedback}
          </p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-3">
            Improvement Plan 🎯
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {focusArea}
          </p>

          <p className="mt-4 text-gray-700">
            Suggested study time:{" "}
            <span className="font-bold">
              {average >= 75 ? "1 hour/day" : average >= 55 ? "2 hours/day" : "3 hours/day"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}