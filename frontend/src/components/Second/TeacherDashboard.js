import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Dashboard.css';
import { categorizeExams } from '../../utils/CategorizeExams';

const TeacherDashboard = () => {
  const { teacherId } = useParams();
  const [teacherName, setTeacherName] = useState('');
  const [liveExams, setLiveExams] = useState([]);
  const [pastExams, setPastExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [selectedExamResults, setSelectedExamResults] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      const res = await fetch(`/api/teacher/${teacherId}`);
      const text = await res.text();
      const data = JSON.parse(text);
      setTeacherName(data.NAME || 'Teacher');
    };

    const fetchExams = async () => {
      const res = await fetch(`/api/teacher/${teacherId}/exams`);
      const data = await res.json();
      console.log("Raw exams from backend:", data);
      const exams = Array.isArray(data) ? data : [];
      const { live, past, upcoming } = categorizeExams(exams);
      setLiveExams(live);
      setPastExams(past);
      setUpcomingExams(upcoming);
    };

    fetchTeacherProfile();
    fetchExams();
  }, [teacherId]);

  const handleSeeResult = async (examId) => {
    const res = await fetch(`/api/exams/${examId}/results`);
    const data = await res.json();
    setSelectedExamResults(data);
    setShowResultModal(true);
  };

  return (
    <div className="dashboard-container">
      <h2>👩‍🏫 Welcome, {teacherName}</h2>

      <section>
        <h3>🟢 Live Exams</h3>
        {liveExams.length === 0 ? <p>No live exams</p> : (
          <ul>
            {liveExams.map(exam => (
              <li key={exam.id} className="exam-card">
                <strong>{exam.title}</strong>
                <p>Ends at {new Date(exam.endTime).toLocaleTimeString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📅 Upcoming Exams</h3>
        {upcomingExams.length === 0 ? <p>No upcoming exams</p> : (
          <ul>
            {upcomingExams.map(exam => (
              <li key={exam.id} className="exam-card">
                <strong>{exam.title}</strong>
                <p>Starts at {new Date(exam.startTime).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📁 Past Exams</h3>
        {pastExams.length === 0 ? <p>No past exams</p> : (
          <ul>
            {pastExams.map(exam => (
              <li key={exam.id} className="exam-card">
                <strong>{exam.title}</strong>
                <p>Ended at {new Date(exam.endTime).toLocaleString()}</p>
                <button onClick={() => handleSeeResult(exam.id)}>View Results</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showResultModal && (
        <div className="popup">
          <div className="popup-content">
            <h4>Results</h4>
            <ul>
              {selectedExamResults.map((r, i) => (
                <li key={i}>{r.studentName}: {r.marks}/{r.total}</li>
              ))}
            </ul>
            <button onClick={() => setShowResultModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;