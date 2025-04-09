import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="app-title">📘 EduEval: Online Examination Platform</h1>

      <div className="card-container">
        {/* Teacher Card */}
        <div className="role-card">
          <h2>👨‍🏫 Teacher</h2>
          <button onClick={() => navigate('/teacher/signup')}>Sign Up as Teacher</button>
          <button onClick={() => navigate('/teacher/login')}>Login as Teacher</button>
        </div>

        {/* Student Card */}
        <div className="role-card">
          <h2>👨‍🎓 Student</h2>
          <button onClick={() => navigate('/student/signup')}>Sign Up as Student</button>
          <button onClick={() => navigate('/student/login')}>Login as Student</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
