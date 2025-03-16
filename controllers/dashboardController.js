exports.showDashboard = (req, res) => {
  const error = req.session.error;
  const success = req.session.success;
  req.session.error = null; // Limpiar el mensaje de error después de mostrarlo
  req.session.success = null; // Limpiar el mensaje de éxito después de mostrarlo
  res.render('dashboard', { empleado: req.empleado, error, success });
};