const Empleado = require('../models/empleado');
const Registro = require('../models/registro');

exports.registrarEntradaSalida = async (req, res, next) => { // Added next()
  try {
    const { tipo, observaciones } = req.body;
    const empleadoId = req.empleado.id;

    const ultimoRegistro = await Registro.findOne({
      where: { EmpleadoId: empleadoId },
      order: [['createdAt', 'DESC']]
    });

    if (ultimoRegistro && ultimoRegistro.tipo === tipo) {
      req.session.mensaje = `No puedes registrar una ${tipo} consecutiva`;
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard'); // This redirect is acceptable for this specific case.
    }

    await Registro.create({
      tipo,
      observacion: observaciones || null,
      EmpleadoId: empleadoId,
    });

    req.session.mensaje = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrada correctamente`;
    req.session.tipoMensaje = 'success';
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al registrar entrada/salida:', error);
    next(error); // Pass the error to the global error handler
  }
};
