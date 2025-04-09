// routes/questionRoutes.js

import express from 'express';
import { addQuestionsToExam } from '../controllers/exam.controller.js'; // Using the same controller for now

const router = express.Router();

console.log("🧠 Question routes loaded");

// ✅ Actual route to add questions to an exam
router.post('/', addQuestionsToExam);

export default router;
