import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { categorizeExams } from '../../utils/CategorizeExams';
import api from '../../services/api';

const StudentDashboard = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState('');
  const [liveExams, setLiveExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [pastExams, setPastExams] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [examCodeInput, setExamCodeInput] = useState('');
  const [error, setError] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      const res = await fetch(`/api/student/${studentId}`);
      const rawText = await res.text();
      const data = JSON.parse(rawText);
      setStudentName(data.NAME || 'Student');
      localStorage.setItem('studentId', studentId); // in case it's needed in attemptExam
    };

    const fetchExams = async () => {
      const res = await fetch(`http://localhost:8000/api/student/${studentId}/exams`);
      const data = await res.json();
      const exams = Array.isArray(data) ? data : [];
      const { live, past, upcoming } = categorizeExams(exams);
      setLiveExams(live);
      setPastExams(past);
      setUpcomingExams(upcoming);
    };

    fetchStudentProfile();
    fetchExams();
  }, [studentId]);

  const handleJoinExamClick = () => {
    setShowModal(true);
    setExamCodeInput('');
    setError('');
  };

  const handleJoin = async () => {
    try {
      const res = await api.post('/api/exams/validate-code', {
        examId: selectedExam?.id,
        examCode: examCodeInput,
        studentId,
      });

      const data = res.data;

      if (!data.valid) {
        throw new Error(data.error || 'Invalid or expired exam code');
      }

      navigate(`/student/exam/${selectedExam?.id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };
  
  async function validateAttempt(id, title){
    try{
      const res = await api.get(`/api/exams/attempt/${id}/studentId = ${studentId}`);
      const data = res.json();
      console.log(data);
    } catch(err){
      setError(err.message || "Something went wrong")
    }
  }

  return (
    <div className="dashboard-container">
      <h2>👋 Welcome, {studentName}</h2>

      <section>
        <h3>🟢 Live Exams</h3>
        {liveExams.length === 0 ? <p>No live exams</p> : (
          <ul>
            {liveExams.map(exam => (
              <li key={exam.id} className="exam-card">
                <strong>{exam.title}</strong>
                <button onClick={() => {
                  setSelectedExam(exam);
                  handleJoinExamClick();
                }}>Join Exam</button>
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
                {validateAttempt(exam.id, exam.title) ? (
                  <>
                    <p><strong>Marks Obtained:</strong> {exam.marks}</p>
                    <button onClick={() => navigate(`/exam/${exam.id}/results`)}>
                      View Result
                    </button>
                  </>
                ) : (
                  <p className="text-muted">Not attempted</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="popup">
          <div className="popup-content">
            <h3>Enter Exam Code</h3>
            <input
              type="text"
              value={examCodeInput}
              onChange={(e) => setExamCodeInput(e.target.value)}
              placeholder="Exam Code"
            />
            {error && <p className="error">{error}</p>}
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleJoin}>Join</button>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;