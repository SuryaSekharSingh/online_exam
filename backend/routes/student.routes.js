import express from 'express';
import {signupStudentWithAddress, getStudentById, getStudentExams} from '../controllers/student.controller.js';
//import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// Student registration with address
router.post('/signup', signupStudentWithAddress);

// Get student profile
router.get('/:studentId', getStudentById);

router.get('/:studentId/exams', getStudentExams);


export default router;