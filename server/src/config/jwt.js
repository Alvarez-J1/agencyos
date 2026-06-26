const DEVELOPMENT_JWT_SECRET = 'agencyos-dev-secret';

const isProduction = () => process.env.NODE_ENV === 'production';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (isProduction()) {
    throw new Error('JWT_SECRET is required when NODE_ENV=production. Set JWT_SECRET before starting the API.');
  }

  return DEVELOPMENT_JWT_SECRET;
};

const validateJwtSecret = () => {
  getJwtSecret();
};

module.exports = { getJwtSecret, validateJwtSecret };
