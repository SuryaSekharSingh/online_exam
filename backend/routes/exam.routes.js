import express from 'express';
import { createExam, getExamDetails, validateExamCode, startExam, finishExam, hasAttempted, getExamResults} from '../controllers/exam.controller.js';
//import { isTeacher } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create exam with questions
router.post('/', /*isTeacher,*/ createExam);

//validating exam code
router.post('/validate-code', validateExamCode);

// Get exam details with questions
router.get('/:id', /*isTeacher,*/ getExamDetails);

router.post('/start', startExam);
router.post('/finish', finishExam);

router.get('/attempt/:examCode', hasAttempted);
router.get('/:examCode/results', getExamResults);
export default router;
