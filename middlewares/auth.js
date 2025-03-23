const jwt = require('jsonwebtoken');
const Empleado = require('../models/empleado');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.empleado = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const empleado = await Empleado.findByPk(decoded.id);

    if (!empleado) {
      console.error('Empleado no encontrado para el ID:', decoded.id);
      req.empleado = null;
      return next();
    }

    req.empleado = empleado;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    req.empleado = null;
    next(); // Crucial: Continue processing even on error
  }
};
