const jwt = require('jsonwebtoken');
const userModel = require("../models/user");

module.exports = async (req, res, next) => {
    // Getting the Authorization header
    const authHeader = req.header('Authorization');

    // Check if the Authorization header is present and correctly formatted
    if (!authHeader || authHeader.split(' ').length !== 2) {
        return res.status(403).json({ message: 'This route is protected, and you cannot access it without a valid token.' });
    }

    const token = authHeader.split(' ')[1]; // Extracting the token

    try {
        // Verifying the token
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user from the JWT payload
        const user = await userModel.findById(jwtPayload.id).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sensitive data like password from the user object
        Reflect.deleteProperty(user, 'password');

        // Attach user to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle errors such as invalid token, expired token, etc.
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};
