// middleware/adminAuth.js (renamed for clarity)
module.exports = (req, res, next) => {
  if (req.empleado && req.empleado.isAdmin) {
    return next();
  }
  req.session.mensaje = 'No tienes permisos para acceder a esta sección.';
  req.session.tipoMensaje = 'error';
  res.redirect('/dashboard'); // Redirect to a more appropriate page if needed
};
