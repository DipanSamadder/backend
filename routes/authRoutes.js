const jwt = require('jsonwebtoken');
const User = require("../models/userModels");

const authentication = async (req, res, next) => {
    try {
        let token;

        // Check if the token is provided in the authorization header
        if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If token is not found, return an error
        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        // Verify the token
        jwt.verify(token, "DIPAN", (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token is not valid" });
            }

            // If the token is valid, attach the decoded information to the request
            const user= User.findById(decoded?.id);
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Authentication problem" });
    }
};

module.exports = { authentication };
