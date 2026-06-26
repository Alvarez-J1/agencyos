const { rateLimit } = require('express-rate-limit');

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const getPositiveInteger = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};

const getRetryAfterSeconds = (resetTime) => {
  if (!(resetTime instanceof Date)) {
    return undefined;
  }

  const seconds = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
  return seconds > 0 ? seconds : undefined;
};

const createJsonHandler = (message) => (req, res, _next, options) => {
  const retryAfterSeconds = getRetryAfterSeconds(req.rateLimit?.resetTime);

  return res.status(options.statusCode).json({
    message,
    ...(retryAfterSeconds ? { retryAfterSeconds } : {})
  });
};

const buildLimiter = ({ identifier, limit, message, windowMs }) =>
  rateLimit({
    identifier,
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: createJsonHandler(message)
  });

const apiRateLimitWindowMs = getPositiveInteger('API_RATE_LIMIT_WINDOW_MS', FIFTEEN_MINUTES_MS);
const authRateLimitWindowMs = getPositiveInteger('AUTH_RATE_LIMIT_WINDOW_MS', FIFTEEN_MINUTES_MS);

const apiLimiter = buildLimiter({
  identifier: 'api',
  windowMs: apiRateLimitWindowMs,
  limit: getPositiveInteger('API_RATE_LIMIT_MAX', 300),
  message: 'Too many API requests. Please try again shortly.'
});

const loginLimiter = buildLimiter({
  identifier: 'auth-login',
  windowMs: authRateLimitWindowMs,
  limit: getPositiveInteger('LOGIN_RATE_LIMIT_MAX', 20),
  message: 'Too many login attempts. Please wait before trying again.'
});

const signupLimiter = buildLimiter({
  identifier: 'auth-signup',
  windowMs: authRateLimitWindowMs,
  limit: getPositiveInteger('SIGNUP_RATE_LIMIT_MAX', 10),
  message: 'Too many signup attempts. Please wait before trying again.'
});

module.exports = { apiLimiter, loginLimiter, signupLimiter };
