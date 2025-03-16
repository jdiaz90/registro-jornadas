exports.showDashboard = (req, res) => {
  res.render('dashboard', { empleado: req.empleado });
};