const jwt = require('jsonwebtoken');

// Middleware para autenticar con JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ success: false, error: 'No se ha proporcionado un token.' });
  }

  try {
    // Verifica el token usando tu clave secreta
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token inválido.', message: error.message });
  }
};

module.exports = authMiddleware;
