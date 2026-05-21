const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");

const app = express();

app.use(cors());


// ======================================
// READ EXCEL FILE
// ======================================

const filePath = path.join(
  __dirname,
  "data",
  "structured_student_dataset.xlsx"
);

const workbook = XLSX.readFile(filePath);

const sheetName = workbook.SheetNames[0];

const students = XLSX.utils.sheet_to_json(
  workbook.Sheets[sheetName]
);


// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});


// ======================================
// GET ALL STUDENTS
// ======================================

app.get("/students", (req, res) => {
  res.json(students);
});


// ======================================
// GET STUDENT BY USN
// ======================================

app.get("/student/:usn", (req, res) => {

  const usn = req.params.usn;

  const studentData = students.filter(
    (student) => student.USN === usn
  );

  res.json(studentData);

});


// ======================================
// START SERVER
// ======================================

app.listen(8000, () => {
  console.log("Server running on port 8000");
});