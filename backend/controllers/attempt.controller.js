import { pool } from '../config/db.js';

export const createAttempt = async (req, res) => {
    try {
        const { studentId, examId, marks } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO ATTEMPT (S_ID, EXAM_ID, MARKS) VALUES (?, ?, ?)`,
            [studentId, examId, marks]
        );

        const [attempt] = await pool.execute(
            `SELECT * FROM ATTEMPT WHERE ATTEMPT_ID = ?`,
            [result.insertId]
        );

        res.status(201).json(attempt[0]);
    } catch (error) {
        res.status(500).json({ 
            error: "Attempt creation failed",
            details: error.message 
        });
    }
};

export const getStudentAttempts = async (req, res) => {
    try {
        const [attempts] = await pool.execute(
            `SELECT a.*, e.EXAM_NAME 
             FROM ATTEMPT a
             JOIN EXAM e ON a.EXAM_ID = e.EXAM_ID
             WHERE a.S_ID = ?`,
            [req.params.studentId]
        );

        res.json(attempts);
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch attempts",
            details: error.message 
        });
    }
};
