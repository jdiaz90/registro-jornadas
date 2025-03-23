const Empleado = require('../models/empleado');
const Registro = require('../models/registro');

exports.registrarEntradaSalida = async (req, res) => {
  try {
    const { tipo, observaciones } = req.body;
    const empleadoId = req.empleado.id;

    // Verificar el último registro del empleado
    const ultimoRegistro = await Registro.findOne({
      where: { EmpleadoId: empleadoId },
      order: [['createdAt', 'DESC']]
    });

    if (ultimoRegistro && ultimoRegistro.tipo === tipo) {
      req.session.mensaje = `No puedes registrar una ${tipo} consecutiva`;
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    // Crear el nuevo registro incluyendo las observaciones (manejo de observaciones undefined)
    const nuevoRegistro = await Registro.create({
      tipo,
      observacion: observaciones || null, // Guarda las observaciones o null si no existen
      EmpleadoId: empleadoId,
    });

    req.session.mensaje = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrada correctamente`;
    req.session.tipoMensaje = 'success'; // Tipo de mensaje correcto fuera del bloque catch
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error al registrar entrada/salida:', error);
    req.session.mensaje = 'Error al registrar entrada/salida. Inténtalo de nuevo.'; // Mensaje más informativo
    req.session.tipoMensaje = 'error';
    res.redirect('/dashboard');
  }
};