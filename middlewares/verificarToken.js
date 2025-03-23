const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Excluir la ruta de login del middleware
    if (req.path === '/auth/login') {
      return next();
    }

    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.empleado = decoded; // Asegúrate de que `decoded` contenga la información del empleado

    if (!req.empleado) {
      return res.status(401).send('Acceso no autorizado. Información del empleado no encontrada.');
    }

    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.redirect('/auth/login');
  }
};