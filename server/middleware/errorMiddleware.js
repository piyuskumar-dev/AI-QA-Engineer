/**
 * Custom application error class to handle classified API errors
 */
export class AppError extends Error {
  constructor(message, status = 500, errorType = "INTERNAL_SERVER_ERROR", suggestion = "Please try again later.") {
    super(message);
    this.status = status;
    this.errorType = errorType;
    this.suggestion = suggestion;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Express error handling middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Log the complete error internally for diagnostics
  console.error(`[ERROR] [${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    errorType: err.errorType || "UNHANDLED_ERROR",
    status: err.status || 500,
    stack: err.stack
  });

  const status = err.status || 500;
  const errorType = err.errorType || "INTERNAL_SERVER_ERROR";
  const message = err.message || "Something went wrong.";
  const suggestion = err.suggestion || "Please try again later.";

  // Send a clean, structured JSON response without internal stack trace
  return res.status(status).json({
    success: false,
    errorType,
    message,
    suggestion
  });
};
