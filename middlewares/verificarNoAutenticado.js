const jwt = require('jsonwebtoken');
const Empleado = require('../models/empleado');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const empleado = await Empleado.findByPk(decoded.id);

    if (empleado) {
      return res.redirect('/dashboard');
    }

    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    next();
  }
};