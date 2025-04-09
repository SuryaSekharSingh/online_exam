import {pool} from '../config/db.js';

export const createFollow = async (req, res) => {
    try {
        const { teacherId, studentId } = req.body;

        // Validate existence first
        const [teacher] = await pool.query(
            'SELECT 1 FROM TEACHER WHERE ID = ?', 
            [teacherId]
        );
        const [student] = await pool.query(
            'SELECT 1 FROM STUDENT WHERE ID = ?', 
            [studentId]
        );

        if (!teacher.length || !student.length) {
            return res.status(404).json({ 
                error: "Teacher or Student not found" 
            });
        }

        await pool.query(
            `INSERT INTO FOLLOWS (T_ID, S_ID)
             VALUES (?, ?)`,
            [teacherId, studentId]
        );

        res.status(201).json({ success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                error: "Already following" 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherFollowers = async (req, res) => {
    try {
        const [followers] = await pool.query(
            `SELECT S.ID, S.NAME, S.EMAIL 
             FROM FOLLOWS F
             JOIN STUDENT S ON F.S_ID = S.ID
             WHERE F.T_ID = ?`,
            [req.params.teacherId]
        );
        
        res.json(followers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};