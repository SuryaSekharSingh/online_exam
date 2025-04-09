import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuestionForm from "./QuestionForm";
import axios from "axios";
import "./CreateExam.css";

const ExamCreate = () => {
  const { teacherId, examId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const addQuestion = (question) => {
    const formattedQuestion = {
      questionText: question.title,
      keywords: question.answer, // storing answer in keywords (can adjust if needed)
      marks: question.marks,
    };
    setQuestions([...questions, formattedQuestion]);
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      alert("⚠️ Add at least one question before submitting");
      return;
    }

    try {
      const payload = {
        examId,
        questions,
      };

      // Backend route to store questions for given exam
      await axios.post("/api/questions", payload);

      alert("✅ Exam submitted successfully!");

      // Redirect to teacher dashboard
      navigate(`/teacher/dashboard/${teacherId}`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit exam.");
    }
  };

  return (
    <div className="create-exam-container">
      <h2>Create Exam</h2>

      <div className="exam-info-form">
        <p>🆔 Exam ID: {examId}</p>
        <p>👨‍🏫 Teacher ID: {teacherId}</p>
        <p>You can now add questions for this exam.</p>
      </div>

      <QuestionForm onAddQuestion={addQuestion} />

      <div className="question-preview">
        {questions.map((q, idx) => (
          <div key={idx} className="question-card">
            <strong>Q{idx + 1}:</strong> {q.questionText} | Keywords:{" "}
            {q.keywords} | Marks: {q.marks}
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Exam
      </button>
    </div>
  );
};

export default ExamCreate;
