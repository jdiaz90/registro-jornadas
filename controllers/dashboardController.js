exports.showDashboard = async (req, res) => {
  try {
    const empleado = req.empleado;
    const mensaje = req.session.mensaje || null;
    const tipoMensaje = req.session.tipoMensaje || null;
    req.session.mensaje = null; // Limpiar el mensaje después de mostrarlo
    req.session.tipoMensaje = null; // Limpiar el tipo de mensaje después de mostrarlo

    res.render('dashboard', { empleado, mensaje, tipoMensaje });
  } catch (error) {
    console.error('Error al mostrar el dashboard:', error);
    res.status(500).send('Error al mostrar el dashboard');
  }
};