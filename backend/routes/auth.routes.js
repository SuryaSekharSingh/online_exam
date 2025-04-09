import express from 'express';
import { 
    studentLogin,
    teacherLogin, logout
} from '../controllers/auth.controller.js';

const router = express.Router();

// Student login
router.post('/student/login', studentLogin);

// Teacher login
router.post('/teacher/login', teacherLogin);

// logout
router.post('/logout', logout);

export default router;