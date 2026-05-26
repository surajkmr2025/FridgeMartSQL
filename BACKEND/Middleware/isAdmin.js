exports.isAdmin = (req, res, next) => {
    // Role-based check (JWT token includes role from login)
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
        });
    }
    next();
};