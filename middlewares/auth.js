const jwt = require('jsonwebtoken');
const Empleado = require('../models/empleado');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.empleado = null; // Asegurarse de que req.empleado esté definido
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const empleado = await Empleado.findByPk(decoded.id);

    if (!empleado) {
      req.empleado = null;
      return next();
    }

    req.empleado = empleado; // Agregar el empleado autenticado al objeto req
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    req.empleado = null;
    next();
  }
};