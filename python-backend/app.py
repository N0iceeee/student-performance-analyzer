from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

df = pd.read_excel("structured_student_dataset.xlsx")

GRADE_POINTS = {
    "A": 10,
    "B": 8,
    "C": 6,
    "D": 4,
    "F": 0
}

SUBJECT_CREDITS = {
    "MAT101": 4, "PHY102": 3, "CHE103": 3, "CSE104": 4,
    "MAT201": 4, "CSE201": 4, "CSE202": 3, "CSE203": 4,
    "MAT301": 4, "CSE301": 4, "CSE302": 4, "CSE303": 3,
    "CSE401": 4, "CSE402": 3, "CSE403": 3, "CSE404": 4,
    "CSE501": 4, "CSE502": 3, "CSE503": 4, "CSE504": 3,
    "CSE601": 4, "CSE602": 3, "CSE603": 3, "CSE604": 4,
    "CSE701": 4, "CSE702": 3, "CSE703": 3, "CSE704": 4,
    "CSE801": 6, "CSE802": 4, "CSE803": 3, "CSE804": 2
}

def calculate_sgpa(student_data):
    total_credit_points = 0
    total_credits = 0

    for _, row in student_data.iterrows():
        credit = SUBJECT_CREDITS.get(row["Subject Code"], 3)
        grade_point = GRADE_POINTS.get(row["Overall Grade"], 0)

        total_credit_points += credit * grade_point
        total_credits += credit

    if total_credits == 0:
        return 0

    return round(total_credit_points / total_credits, 2)

def predict_future_score(marks):
    x = np.array([1, 2, 3])
    y = np.array(marks)

    slope, intercept = np.polyfit(x, y, 1)
    predicted = slope * 4 + intercept

    predicted = max(0, min(30, predicted))

    return round(float(predicted), 2)

def get_consistency_level(std_dev):
    if std_dev <= 2:
        return "Highly Consistent"
    elif std_dev <= 5:
        return "Moderately Consistent"
    else:
        return "Inconsistent"

@app.route("/")
def home():
    return "Python Flask Backend Running 🚀"

@app.route("/students")
def get_students():
    return jsonify(df.to_dict(orient="records"))

@app.route("/student/<usn>")
def get_student(usn):
    student_data = df[df["USN"] == usn]
    return jsonify(student_data.to_dict(orient="records"))

@app.route("/analysis/<usn>/<semester>")
def get_analysis(usn, semester):
    student_data = df[
        (df["USN"] == usn) &
        (df["Semester"] == int(semester))
    ]

    if student_data.empty:
        return jsonify({"error": "Student not found"})

    internal_average = (
        student_data["Internal 1"] +
        student_data["Internal 2"] +
        student_data["Internal 3"]
    ) / 3

    internal_percentage = (internal_average / 30) * 100

    overall_average = float(np.mean(internal_average))
    overall_percentage = float(np.mean(internal_percentage))

    strongest_subject = student_data.iloc[np.argmax(internal_average)]["Subject Name"]
    weakest_subject = student_data.iloc[np.argmin(internal_average)]["Subject Name"]

    assignment_percentage = (student_data["Assignment Score"] / 10) * 100

    performance_scores = (
    0.5 * internal_percentage +
    0.5 * assignment_percentage
   )
    
    predicted_score = float(np.mean(performance_scores))

    if predicted_score >= 85:
        predicted_grade = "A"
    elif predicted_score >= 70:
        predicted_grade = "B"
    elif predicted_score >= 55:
        predicted_grade = "C"
    elif predicted_score >= 40:
        predicted_grade = "D"
    else:
        predicted_grade = "F"

    predicted_sgpa = calculate_sgpa(student_data)

    future_predictions = []
    consistency_analysis = []

    for _, row in student_data.iterrows():
        marks = [
            row["Internal 1"],
            row["Internal 2"],
            row["Internal 3"]
        ]

        variance = float(np.var(marks))
        std_dev = float(np.std(marks))

        future_predictions.append({
            "subject": row["Subject Name"],
            "subject_code": row["Subject Code"],
            "predicted_future_score": predict_future_score(marks),
            "max_marks": 30
        })

        consistency_analysis.append({
            "subject": row["Subject Name"],
            "subject_code": row["Subject Code"],
            "variance": round(variance, 2),
            "standard_deviation": round(std_dev, 2),
            "consistency_level": get_consistency_level(std_dev)
        })

    return jsonify({
        "student_name": student_data.iloc[0]["Student Name"],
        "usn": usn,
        "semester": semester,
        "overall_average": round(overall_average, 2),
        "overall_percentage": round(overall_percentage, 2),
        "strongest_subject": strongest_subject,
        "weakest_subject": weakest_subject,
        "predicted_score": round(predicted_score, 2),
        "predicted_grade": predicted_grade,
        "predicted_sgpa": predicted_sgpa,
        "future_predictions": future_predictions,
        "consistency_analysis": consistency_analysis
    })

if __name__ == "__main__":
    app.run(debug=True, port=9000)