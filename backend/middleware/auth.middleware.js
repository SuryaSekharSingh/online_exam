// Simple auth check
export const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please login first' });
    }
    next();
};

// Teacher-only access
export const isTeacher = (req, res, next) => {
    if (req.session.user?.role !== 'teacher') {
        return res.status(403).json({ error: 'Teacher access required' });
    }
    next();
};