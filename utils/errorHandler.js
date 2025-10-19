/**
 * Error Handler Utility
 * 
 * Provides centralized error handling and logging for the application.
 * Includes retry logic, custom error classes, and error formatting.
 */

/**
 * Custom Application Error Class
 * @extends Error
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} isOperational - Whether error is operational (expected)
   */
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error Class
 * @extends AppError
 */
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error Class
 * @extends AppError
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error Class
 * @extends AppError
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error Class
 * @extends AppError
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Retry Logic for Async Operations
 * 
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} Result of the function
 */
async function retryAsync(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw new AppError(
    `Operation failed after ${maxRetries} attempts: ${lastError.message}`,
    500
  );
}

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Error Response Formatter
 * 
 * @param {Error} error - Error object
 * @param {boolean} includeStack - Whether to include stack trace
 * @returns {Object} Formatted error response
 */
function formatError(error, includeStack = false) {
  const response = {
    success: false,
    error: {
      message: error.message || 'Internal Server Error',
      statusCode: error.statusCode || 500,
      timestamp: error.timestamp || new Date().toISOString()
    }
  };

  if (error.errors) {
    response.error.errors = error.errors;
  }

  if (includeStack && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
}

/**
 * Global Error Handler Middleware
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Log error
  console.error('Error:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json(formatError(err));
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(formatError(
      new AuthenticationError('Invalid token')
    ));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(formatError(
      new AuthenticationError('Token expired')
    ));
  }

  // Handle Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(formatError(
      new ValidationError('File too large')
    ));
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json(formatError(
      new ValidationError('Too many files')
    ));
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const includeStack = process.env.NODE_ENV === 'development';
  
  res.status(statusCode).json(formatError(err, includeStack));
}

/**
 * 404 Not Found Handler
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  res.status(404).json(formatError(
    new NotFoundError(`Route ${req.url}`)
  ));
}

/**
 * Validate Request Body
 * 
 * @param {Object} schema - Validation schema
 * @returns {Function} Middleware function
 */
function validateRequest(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && !value) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value && rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    next();
  };
}

/**
 * Safe JSON Parse
 * 
 * @param {string} str - JSON string to parse
 * @param {*} defaultValue - Default value if parse fails
 * @returns {*} Parsed object or default value
 */
function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    return defaultValue;
  }
}

/**
 * Log Error to External Service
 * (Placeholder for external logging service integration)
 * 
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context
 */
async function logErrorToService(error, context = {}) {
  // TODO: Integrate with external logging service (e.g., Sentry, LogRocket)
  console.error('Error logged:', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  retryAsync,
  asyncHandler,
  formatError,
  errorHandler,
  notFoundHandler,
  validateRequest,
  safeJsonParse,
  logErrorToService
};
