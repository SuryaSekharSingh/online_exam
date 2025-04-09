import { pool } from '../config/db.js';

import {Exam} from '../models/exam.model.js'; // Adjust path if needed
// import {Student} from '../models/student.model.js'; // Optional for validation
// controllers/exam.controller.js
//import { Question } from '../models/question.model.js';


export const createExam = async (req, res) => {
  try {
    const { teacherId, examName, examTime } = req.body;

    const [result] = await pool.query(
      `INSERT INTO EXAM (TEACHER_ID, EXAM_NAME, EXAM_TIME) VALUES (?, ?, ?)`,
      [teacherId, examName, examTime]
    );

    res.status(201).json({
      success: true,
      examId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addQuestionsToExam = async (req, res) => {
  try {
    const { examId, questions } = req.body;

    console.log('🔥 Received theoretical questions for exam:', examId, questions);

    const values = questions.map(q => [
      examId,
      q.questionText,
      q.keywords || '',  // optional, can be empty
      q.marks || 0        // default to 0 if not given
    ]);

    await pool.query(
      `INSERT INTO QUESTION 
      (EXAM_ID, QUESTION_TEXT, KEYWORDS, MARKS)
      VALUES ?`,
      [values]
    );

    res.status(201).json({ message: '✅ Theoretical questions added successfully' });
  } catch (err) {
    console.error('❌ Error in addQuestionsToExam:', err);
    res.status(500).json({ error: 'Failed to add theoretical questions' });
  }
};

export const getExamDetails = async (req, res) => {
  try {
    const [exams] = await pool.query(
      `SELECT * FROM EXAM WHERE EXAM_ID = ?`,
      [req.params.id]
    );

    if (exams.length === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const [questions] = await pool.query(
      `SELECT * FROM QUESTION WHERE EXAM_ID = ?`,
      [req.params.id]
    );

    res.json({
      exam: exams[0],
      questions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Restoring the missing function

export const validateExamCode = async (req, res) => {
  try {
    const { examId, examCode } = req.body;

    if (!examId || !examCode) {
      return res.status(400).json({ valid: false, error: "Exam ID and code are required" });
    }

    const [exams] = await pool.execute(
      `SELECT EXAM_ID, EXAM_NAME, EXAM_TIME FROM EXAM 
       WHERE EXAM_ID = ? AND EXAM_NAME = ?`,
      [examId, examCode]
    );

    if (exams.length === 0) {
      return res.status(400).json({ valid: false, error: "Invalid exam code" });
    }

    const exam = exams[0];
    const now = new Date();
    const startTime = new Date(exam.EXAM_TIME);
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours after start

    if (now < startTime || now > endTime) {
      return res.status(403).json({ valid: false, error: "Exam is not live right now" });
    }

    res.json({
      valid: true,
      exam: {
        id: exam.EXAM_ID,
        title: exam.EXAM_NAME,
        startTime: exam.EXAM_TIME
      }
    });
  } catch (error) {
    console.error("Error validating exam code:", error);
    res.status(500).json({ valid: false, error: "Server error" });
  }
};


export const startExam = async (req, res) => {
  const { examId, studentId } = req.body;
  console.log("Start Exam:", { examId, studentId });

  try {
    const [examRows] = await pool.execute('SELECT * FROM EXAM WHERE EXAM_ID = ?', [examId]);

    if (examRows.length === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const [questionRows] = await pool.execute('SELECT * FROM QUESTION WHERE EXAM_ID = ?', [examId]);

    res.json({
      examId,
      examName: examRows[0].EXAM_NAME,
      duration: 60, // hardcoded for now or derive from EXAM_TIME
      questions: questionRows.map(q => ({
        id: q.QUESTION_ID,
        text: q.QUESTION_TEXT,
        keywords: q.KEYWORDS,
        marks: q.MARKS
      }))
    });
  } catch (err) {
    console.error("Start exam error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const finishExam = async (req, res) => {
  const { examCode, studentId, totalMarks } = req.body;

  try {
    // Get EXAM_ID from code
    const [examRows] = await pool.query('SELECT EXAM_ID FROM EXAM WHERE EXAM_ID = ?', [examCode]);

    if (examRows.length === 0) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    const examId = examRows[0].EXAM_ID;

    // Insert attempt
    await pool.query(
      'INSERT INTO ATTEMPT (S_ID, EXAM_ID, MARKS) VALUES (?, ?, ?)',
      [studentId, examId, totalMarks]
    );

    res.status(200).json({ message: 'Exam submitted successfully.' });
  } catch (error) {
    console.error('Error finishing exam:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const hasAttempted = async(req, res) => {
  const { examCode } = req.params;
  const { studentId } = req.query;

  try {
    const [result] = await pool.execute(
      `SELECT * FROM ATTEMPT WHERE EXAM_ID = ? AND S_ID = ?`,
      [examCode, studentId]
    );
    res.json({ hasAttempted: result.length > 0 });
  } catch (err) {
    console.error("Error checking attempt", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getExamResults = async (req, res) => {
  const { examCode } = req.params;

  try {
    // 1. Get exam details
    const [examData] = await pool.execute(
      `SELECT EXAM_ID as title, MARKS as totalMarks, RANK FROM ATTEMPT WHERE EXAM_ID = ?`,
      [examCode]
    );

    if (examData.length === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const examInfo = examData[0];

    // 2. Get all attempts for that exam
    const [attempts] = await pool.execute(
      `SELECT a.S_ID as studentId, s.NAME as studentName, a.MARKS as marks
       FROM ATTEMPT a
       JOIN STUDENT s ON a.S_ID = s.STUDENT_ID
       WHERE a.EXAM_ID = ?
       ORDER BY a.MARKS DESC`,
      [examCode]
    );

    // 3. Send as response
    res.status(200).json({
      exam: examInfo,
      results: attempts
    });

  } catch (err) {
    console.error("❌ Error fetching exam results", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
