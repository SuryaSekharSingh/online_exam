// controllers/teacher.controller.js

import { pool } from '../config/db.js';
import { Exam } from '../models/exam.model.js';
export const signupTeacherWithAddress = async (req, res) => {
    try {
        const { teacherData, addressData } = req.body;

        // 1. Insert Teacher
        const [teacherResult] = await pool.query(
            `INSERT INTO TEACHER SET ?`,
            [teacherData]
        );

        // 2. Insert Address
        await pool.query(
            `INSERT INTO address SET ?`,
            { ...addressData, teacher_id: teacherResult.insertId }
        );

        res.status(201).json({ 
            success: true, 
            userId: teacherResult.insertId 
        });
    } catch (error) {
        // Handle specific MySQL errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                error: "Email already exists" 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log("Backend received teacherId:", teacherId);
  
    const [rows] = await pool.query(
      `SELECT * FROM teacher WHERE id = ?`,
      [teacherId]
    );
  
    console.log("DB Response:", rows);
  
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
  
    // ✅ Correct logging of object
    console.log("Teacher found:", JSON.stringify(rows[0]));
  
    // ✅ Return the teacher object as JSON
    res.status(200).json(rows[0]);
      
  } catch (error) {
    console.error("Error in getTeacherById:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getExamsByTeacher = async (req, res) => {
  const teacherId = req.params.id;
  console.log("📥 getExamsByTeacher called with ID:", teacherId);

  try {
    const [exams] = await pool.query(
      `SELECT * FROM exam WHERE TEACHER_ID = ?`,
      [teacherId]
    );

    console.log("✅ Exams found:", exams);
    res.status(200).json(exams);
  } catch (err) {
    console.error("❌ Error fetching exams:", err);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

