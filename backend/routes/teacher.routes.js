import express from 'express';
import { signupTeacherWithAddress, getTeacherById, getExamsByTeacher } from '../controllers/teacher.controller.js';
// import { isTeacher } from '../middleware/auth.middleware.js';

const router = express.Router();

// Teacher registration with address

router.post('/signup', signupTeacherWithAddress);

// Get teacher profile
router.get('/:teacherId', getTeacherById);
// router.get('/:id', isTeacher, getTeacherProfile);
router.get('/:id/exams', getExamsByTeacher);


export default router;