// middlewares/verificarToken.js
const jwt = require('jsonwebtoken');
const Empleado = require('../models/empleado');

async function verificarToken(req, res, next) {
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
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
  } catch (err) {
    console.error('Error al verificar el token:', err);
    return res.redirect('/login');
  }
}

module.exports = verificarToken;
