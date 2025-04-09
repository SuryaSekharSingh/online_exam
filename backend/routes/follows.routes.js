import express from 'express';
import { createFollow, getTeacherFollowers} from '../controllers/follows.controller.js';

const router = express.Router();

// Follow a teacher
router.post('/', createFollow);

// Get all followers for a teacher
router.get('/teacher/:teacherId', getTeacherFollowers);

export default router;