const Empleado = require('../models/empleado');
const Registro = require('../models/registro');

exports.createEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.create(req.body);
    res.status(201).json(empleado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registrarEntrada = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.empleado.id) {
      req.session.mensaje = 'No estás autorizado para fichar en nombre de otro empleado';
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      req.session.mensaje = 'Empleado no encontrado';
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    // Verificar el último registro
    const ultimoRegistro = await Registro.findOne({
      where: { EmpleadoId: empleado.id },
      order: [['createdAt', 'DESC']]
    });

    if (ultimoRegistro && ultimoRegistro.tipo === 'entrada') {
      req.session.mensaje = 'No puedes registrar una entrada cuando la última acción fue una entrada';
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    const registro = await Registro.create({
      tipo: 'entrada',
      EmpleadoId: empleado.id
    });

    req.session.mensaje = 'Entrada registrada correctamente';
    req.session.tipoMensaje = 'exito';
    res.redirect('/dashboard');
  } catch (error) {
    req.session.mensaje = error.message;
    req.session.tipoMensaje = 'error';
    res.redirect('/dashboard');
  }
};

exports.registrarSalida = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.empleado.id) {
      req.session.mensaje = 'No estás autorizado para fichar en nombre de otro empleado';
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      req.session.mensaje = 'Empleado no encontrado';
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    // Verificar el último registro
    const ultimoRegistro = await Registro.findOne({
      where: { EmpleadoId: empleado.id },
      order: [['createdAt', 'DESC']]
    });

    if (!ultimoRegistro) {
      req.session.mensaje = 'No puedes registrar una salida sin haber registrado una entrada primero';
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    if (ultimoRegistro.tipo === 'salida') {
      req.session.mensaje = 'No puedes registrar una salida cuando la última acción fue una salida';
      req.session.tipoMensaje = 'error';
      return res.redirect('/dashboard');
    }

    const registro = await Registro.create({
      tipo: 'salida',
      EmpleadoId: empleado.id
    });

    req.session.mensaje = 'Salida registrada correctamente';
    req.session.tipoMensaje = 'exito';
    res.redirect('/dashboard');
  } catch (error) {
    req.session.mensaje = error.message;
    req.session.tipoMensaje = 'error';
    res.redirect('/dashboard');
  }
};