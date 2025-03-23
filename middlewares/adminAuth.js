// middlewares/adminAuth.js
module.exports = (req, res, next) => {
  if (req.empleado && req.empleado.isAdmin) {
    return next();
  }

  // Set a session message indicating unauthorized access
  req.session.mensaje = 'No tienes permisos para acceder a esta sección.';
  req.session.tipoMensaje = 'danger';

  // Redirect to a more appropriate page (e.g., dashboard or login)
  return res.redirect('/dashboard'); // Or res.redirect('/login') depending on your app
};
