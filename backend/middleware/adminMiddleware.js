// middleware/adminMiddleware.js
module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admin rights required.' });
  }
  next();
};