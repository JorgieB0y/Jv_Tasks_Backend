import jwt  from "jsonwebtoken";
import User from "../models/User.js";

export const checkAuth = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Using the decoded token we can pass into the request of the API that bearer's token as a user 
            req.user = await User.findById(decoded.id).select("-password -confirmed -token -createdAt -updatedAt -__v");

            return next();
        } catch (error) {
            return res.status(404).json({ message: `There was an error: ${error.message}` })
        }
    } else {
        const error = new Error('Invalid user token')
        return res.status(401).json({ message: error.message })
    }

    next();
}