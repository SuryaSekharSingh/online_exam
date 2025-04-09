import express from 'express'
import { createAttempt, getStudentAttempts } from '../controllers/attempt.controller.js'
import { isAuthenticated } from '../middleware/auth.middleware.js'

const router = express.Router()

// 🔐 Create a new exam attempt (authentication optional based on app flow)
router.post('/', /* isAuthenticated, */ createAttempt)

// 📚 Get all attempts of a specific student
router.get('/student/:studentId', isAuthenticated, getStudentAttempts)

export default router
