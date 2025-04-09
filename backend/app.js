import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';

import studentRoutes from './routes/student.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import authRoutes from './routes/auth.routes.js';
import examRoutes from './routes/exam.routes.js';
import followsRoutes from './routes/follows.routes.js';
import attemptRoutes from './routes/attempt.routes.js';
import addressRoutes from './routes/address.routes.js';
import questionRoutes from './routes/question.routes.js';

import { pool, initializeDatabase } from './config/db.js';

dotenv.config();

async function startServer() {
    try {
        await initializeDatabase();

        const app = express();

        // ✅ Enable CORS for frontend
        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
        }));

        app.use(express.json());

        app.use(session({
            secret: process.env.SESSION_SECRET || 'dev_secret_123',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            }
        }));

        // ✅ All API Routes
        app.use('/api/student', studentRoutes);
        app.use('/api/teacher', teacherRoutes);
        app.use('/api/auth', authRoutes);
        app.use('/api/exams', examRoutes);
        app.use('/api/questions', questionRoutes);
        app.use('/api/follows', followsRoutes);
        app.use('/api/attempts', attemptRoutes);
        app.use('/api/addresses', addressRoutes);

        // ✅ 404 Handler
        app.use((req, res) => {
            res.status(404).json({ error: 'Endpoint not found' });
        });

        // ✅ Error Handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal server error' });
        });

        // ✅ Start Server
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
