import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const { teacherId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract role from path
  const role = location.pathname.includes('student') ? 'student' :
               location.pathname.includes('teacher') ? 'teacher' : '';

  // Extract userId from the URL (last segment)
  const userId = location.pathname.split('/').filter(Boolean).pop();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [examCode, setExamCode] = useState('');
  const [error, setError] = useState('');
  const [createExamData, setCreateExamData] = useState({
    examCode: '',
    date: '',
    time: '',
    duration: ''
  });

  const handleLogout = () => {
    navigate('/');
  };

  const handleJoin = async () => {
    if (!examCode.trim()) {
      setError('⚠️ Please enter the exam code');
      return;
    }

    try {
      const response = await axios.get(`/api/exams/validate/${examCode.trim()}`);
      if (response.data.success) {
        setShowJoinModal(false);
        navigate(`/exam/${examCode.trim()}/start`);
      } else {
        setError('❌ Invalid or inactive exam code');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Server error. Please try again later.');
    }
  };

  const handleCreateExam = async () => {
    const { examCode, date, time, duration } = createExamData;
    if (!examCode || !date || !time || !duration) {
      setError('⚠️ All fields are required');
      return;
    }
  
    try {
      const examTime = `${date} ${time}:00`;
  
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teacherId,
          examName: examCode,
          examTime
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create exam');
      }
  
      console.log('✅ Exam created:', data);
  
      // Navigate to the exam creation page (where you add questions etc.)
      navigate(`/teacher/exam/${teacherId}/${data.examId}`);
  
      // Clear modal and input state
      setShowCreateModal(false);
      setCreateExamData({ examCode: '', date: '', time: '', duration: '' });
    } catch (err) {
      console.error('❌ Backend error:', err.message);
      setError(`❌ ${err.message}`);
    }
  };
  

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="brand" onClick={() => navigate('/')}>EduVal</h1>
      </div>

      <div className="navbar-right">
        {role === 'student' && (
          <button className="nav-btn" onClick={() => setShowJoinModal(true)}>
            Join Exam
          </button>
        )}

        {role === 'teacher' && (
          <button className="nav-btn" onClick={() => setShowCreateModal(true)}>
            <span className="plus-icon">＋</span> Create Exam
          </button>
        )}

        <button className="nav-btn logout" onClick={handleLogout}>
          Logout
        </button>

        {userId && (
          <CgProfile
            className="profile-icon"
            onClick={() => navigate(`/profile/${role}/${userId}`)}
          />
        )}
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Exam Code</h3>
            <input
              type="text"
              placeholder="Exam Code"
              value={examCode}
              onChange={(e) => {
                setError('');
                setExamCode(e.target.value);
              }}
            />
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
              <button className="nav-btn" onClick={handleJoin}>Join</button>
              <button
                className="nav-btn logout"
                onClick={() => {
                  setShowJoinModal(false);
                  setExamCode('');
                  setError('');
                }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Exam</h3>
            <input
              type="text"
              placeholder="Exam Code"
              value={createExamData.examCode}
              onChange={(e) =>
                setCreateExamData({ ...createExamData, examCode: e.target.value })
              }
            />
            <input
              type="date"
              value={createExamData.date}
              onChange={(e) =>
                setCreateExamData({ ...createExamData, date: e.target.value })
              }
            />
            <input
              type="time"
              value={createExamData.time}
              onChange={(e) =>
                setCreateExamData({ ...createExamData, time: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={createExamData.duration}
              onChange={(e) =>
                setCreateExamData({ ...createExamData, duration: e.target.value })
              }
            />
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
              <button className="nav-btn" onClick={handleCreateExam}>Create</button>
              <button
                className="nav-btn logout"
                onClick={() => {
                  setShowCreateModal(false);
                  setError('');
                  setCreateExamData({ examCode: '', date: '', time: '', duration: '' });
                }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
