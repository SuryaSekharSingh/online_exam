import {pool} from '../config/db.js';

// Common login logic
const loginUser = async (userType, email, password) => {
    const table = userType === 'student' ? 'STUDENT' : 'TEACHER';
    
    const [users] = await pool.query(
        `SELECT ID, NAME, EMAIL, CONTACT FROM ${table} 
         WHERE EMAIL = ? AND PASSWORD = ?`,
        [email, password]
    );

    if (users.length === 0) {
        throw new Error('Invalid email or password');
    }

    return users[0];
};

export const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser('student', email, password);
        
        // Store minimal user data in session
        req.session.user = {
            id: user.ID,
            role: 'student'
        };
        
        res.json({ 
            message: 'Student login successful',
            user: {
                id: user.ID,
                name: user.NAME,
                email: user.EMAIL
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginUser('teacher', email, password);
        
        req.session.user = {
            id: user.ID,
            role: 'teacher'
        };

        res.json({ 
            message: 'Teacher login successful',
            user: {
                id: user.ID,
                name: user.NAME,
                email: user.EMAIL
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');  // Clear session cookie
        res.json({ message: 'Logged out successfully' });
    });
};

export const checkAuth = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not logged in' });
    }
    res.json({ 
        isAuthenticated: true,
        user: req.session.user 
    });
};