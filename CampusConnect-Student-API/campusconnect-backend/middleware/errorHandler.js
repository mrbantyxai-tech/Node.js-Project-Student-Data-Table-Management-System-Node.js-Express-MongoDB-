export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (error.code === 11000) {
    return res.status(409).json({ success: false, message: 'A student with this email already exists.' });
  }
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(item => item.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
  }
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: 'Invalid student ID format.' });
  }
  console.error(error);
  res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error.' });
}
