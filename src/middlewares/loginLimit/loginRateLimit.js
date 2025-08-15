import rateLimit from "express-rate-limit";

/**
 * Rate limiter per IP for login route.
 * Blocks more than 10 attempts from the same IP in 20 minutes.
 */
const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: "Too many login attempts. Please try again later."
    }
})

export default loginRateLimit;