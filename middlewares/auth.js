const jwt = require('jsonwebtoken');
const Empleado = require('../models/empleado');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const empleado = await Empleado.findByPk(decoded.id, {
      attributes: ['id', 'nombre', 'apellidos', 'dni', 'email'] // Selecciona los campos que necesitas
    });

    if (!empleado) {
      return res.redirect('/login');
    }

    req.empleado = empleado;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.redirect('/login');
  }
};
