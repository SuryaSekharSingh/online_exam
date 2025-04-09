// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './Pages/Login'
import Register from './Pages/Register';
import TeacherMain from './Pages/TeacherMain';
import StudentMain from './Pages/StudentMain';
import Profile from './Pages/Profile';
import ExamAttempt from './Pages/ExamAttempt';
import ExamCreate from './Pages/ExamCreate';
import Result from './Pages/Result';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/:role/login" element={<Login />} />
      <Route path="/:role/signup" element={<Register />} />
      <Route path="/teacher/dashboard/:teacherId" element={<TeacherMain />} />
      <Route path="/student/dashboard/:studentId" element={<StudentMain />} />
      <Route path="/profile/:role/:userId" element={<Profile />} />
      <Route path="/student/exam/:examCode" element={<ExamAttempt />} />
      <Route path="/teacher/exam/:teacherId/:examId" element={<ExamCreate />} />
      <Route path="/exam/:examCode/results" element={<Result />} />
    </Routes>
  );
};

export default App;
