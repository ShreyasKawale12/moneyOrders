import jwt from "jsonwebtoken";
import * as q from '../sqlQueries/query.js'

export const verifyTokenManager = async (req, res, next) => {
    console.log("verifying token")
    // console.log('Headers:', req.headers);
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    if (!authHeader) {
        return res.status(403).json({ message: 'Hello Authorization header is required.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token is required.' });
    }

    jwt.verify(token, 'shrimps', async (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.username = user;
        const result= await q.getUserByUsername(user['username'])
        // console.log(user['username'])
        if(result.designation!=='manager'){
            return res.status(401).json({ message: 'Invalid token.' });
        }
        next();
    });
};

