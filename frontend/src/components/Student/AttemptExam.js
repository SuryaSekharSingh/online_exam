import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import axios from 'axios';
import api from '../../services/api';

const AttemptExam = () => {
  const { examCode } = useParams(); // ✅ extract examCode from URL
  const [step, setStep] = useState('rules');
  const [examData, setExamData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  // const [totalMarks, setTotalMarks] = useState(0);
  // const totalMarksRef = useRef(0);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        console.log(examCode);
        const res = await api.post('/api/exams/start', {
          examId: examCode
        });
        setExamData(res.data);
        setTimeLeft(res.data.duration * 60);
      } catch (err) {
        alert('Invalid or expired exam code');
      }
    };

    fetchExamData();
  }, [examCode]);

  useEffect(() => {
    if (step !== 'exam' || timeLeft === null) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const handleStart = () => setStep('exam');

  const handleAnswerSubmit = () => {
    const question = examData.questions[currentQIndex];
  
    // Safe fallback if keywords are missing
    const rawKeywords = question.keywords || '';
    const keywords = rawKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);
  
    // Normalize the answer into lowercase words
    const answerWords = answer.trim().toLowerCase().split(/\s+/);
  
    // Debug logs to verify matching
    console.log('Keywords:', keywords);
    console.log('Answer words:', answerWords);
  
    // Use Set to prevent duplicates and optimize lookups
    const answerSet = new Set(answerWords);
    const matched = keywords.filter(keyword => answerSet.has(keyword)).length;
  
    const totalKeywords = keywords.length || 1;
    const marksAwarded = Math.round((matched / totalKeywords) * question.marks);
  
    console.log(`Matched ${matched}/${totalKeywords} → Marks: ${marksAwarded}`);
  
    setScore(prev => prev + marksAwarded);
    setAnswer('');
  
    if (currentQIndex + 1 < examData.questions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      handleFinalSubmit(score + marksAwarded);
    }
  };
  




  const handleFinalSubmit = async (lastMarks = 0) => {
    try {
      await api.post('/api/exams/finish', {
        examCode: examCode,
        studentId: localStorage.getItem('studentId'),
        totalMarks: lastMarks 
      });
      setStep('finished');
    } catch (err) {
      alert('Error finishing exam');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!examData) return <div>Loading Exam...</div>;

  if (step === 'rules') {
    return (
      <div className="rules-container">
        <h2>📝 Exam Rules</h2>
        <ul>
          <li>Each question appears once only</li>
          <li>Answer immediately to proceed</li>
          <li>Exam auto-submits on time expiry</li>
        </ul>
        <button onClick={handleStart}>Start Exam</button>
      </div>
    );
  }

  if (step === 'exam') {
    const question = examData.questions[currentQIndex];
    return (
      <div className="exam-container">
        <div className="exam-header">
          <span>Exam Code: {examCode}</span>
          <span>⏱ Time Left: {formatTime(timeLeft)}</span>
        </div>
        <div className="question">
          <h3>Q{currentQIndex + 1}: {question.text}  [{question.marks} Marks]</h3>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={handleAnswerSubmit}>Submit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-finish">
      <h2>✅ Exam Completed</h2>
      <p>Your Score: {score}</p>
    </div>
  );
};

export default AttemptExam;
