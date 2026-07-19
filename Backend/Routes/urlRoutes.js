// import express from "express";
// import { createShortUrl, getUrlAnalytics, redirectUrl } from "../Controllers/url.js";

// const router = express.Router();

// // Create a short URL
// router.post("/shorten", createShortUrl);

// // Redirect from short URL → original URL
// router.get("/:shortID", redirectUrl);

// // Get analytics for a short URL
// router.get("/analytics/:shortUrl", getUrlAnalytics);

// export default router;
import express from "express";
import { createShortUrl, getUrlAnalytics, redirectUrl } from "../Controllers/url.js";

const router = express.Router();

// Create a short URL
router.post("/shorten", createShortUrl);

// Get analytics for a short URL (put this BEFORE the redirect route to avoid conflicts)
router.get("/analytics/:shortId", getUrlAnalytics);

// Redirect from short URL → original URL (this should be last to catch all other patterns)
router.get("/:shortId", redirectUrl);

export default router;
