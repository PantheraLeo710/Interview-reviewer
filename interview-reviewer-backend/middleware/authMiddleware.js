const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config'); 

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        console.log("Token received:", token);
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded user:", decoded);

        req.user = {
            _id: decoded.id, // 👈 add this
            name: decoded.name,
            email: decoded.email,
            isStaff: decoded.isStaff,
        };


        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = authenticateToken;
