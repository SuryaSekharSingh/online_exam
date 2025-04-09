import {pool} from '../config/db.js';

export const signupStudentWithAddress = async (req, res) => {
    try {
        const { studentData, addressData } = req.body;

        // 1. Insert Student
        const [studentResult] = await pool.query(
            `INSERT INTO STUDENT SET ?`,
            [studentData] // Assume studentData matches table columns
        );
        
        // 2. Insert Address
        await pool.query(
            `INSERT INTO address SET ?`,
            { ...addressData, student_id: studentResult.insertId }
        );

        res.status(201).json({ 
            success: true, 
            userId: studentResult.insertId 
        });
    } catch (error) {
        // Handle partial failure
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ 
                error: "Student does not exist" 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

 // adjust if your DB config file is in another path

export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("Backend received studentId:", studentId);

    const [rows] = await pool.query(
      `SELECT * FROM student WHERE id = ?`,
      [studentId]
    );

    console.log("DB Response:", rows);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    console.log("Student found:", JSON.stringify(rows[0]));

    res.status(200).json(rows[0]);

  } catch (error) {
    console.error("Error in getStudentById:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getStudentExams = async (req, res) => {
  try {
    console.log("Fetching all exams for student view");

    const [exams] = await pool.query(
      `SELECT EXAM_ID, EXAM_NAME, EXAM_TIME, TEACHER_ID
      FROM exam`
    );

    console.log("Exams fetched:", exams);
    res.status(200).json(exams);
  } catch (error) {
    console.error("❌ Error fetching exams:", error);
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};


