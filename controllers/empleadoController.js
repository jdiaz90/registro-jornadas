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
      req.session.error = 'No estás autorizado para fichar en nombre de otro empleado';
      return res.redirect('/dashboard');
    }

    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      req.session.error = 'Empleado no encontrado';
      return res.redirect('/dashboard');
    }

    // Verificar el último registro
    const ultimoRegistro = await Registro.findOne({
      where: { EmpleadoId: empleado.id },
      order: [['createdAt', 'DESC']]
    });

    if (ultimoRegistro && ultimoRegistro.tipo === 'entrada') {
      req.session.error = 'No puedes registrar una entrada cuando la última acción fue una entrada';
      return res.redirect('/dashboard');
    }

    const registro = await Registro.create({
      tipo: 'entrada',
      EmpleadoId: empleado.id
    });

    req.session.success = 'Entrada registrada correctamente';
    res.redirect('/dashboard');
  } catch (error) {
    req.session.error = error.message;
    res.redirect('/dashboard');
  }
};

exports.registrarSalida = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.empleado.id) {
      req.session.error = 'No estás autorizado para fichar en nombre de otro empleado';
      return res.redirect('/dashboard');
    }

    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      req.session.error = 'Empleado no encontrado';
      return res.redirect('/dashboard');
    }

    // Verificar el último registro
    const ultimoRegistro = await Registro.findOne({
      where: { EmpleadoId: empleado.id },
      order: [['createdAt', 'DESC']]
    });

    if (!ultimoRegistro) {
      req.session.error = 'No puedes registrar una salida sin haber registrado una entrada primero';
      return res.redirect('/dashboard');
    }

    if (ultimoRegistro.tipo === 'salida') {
      req.session.error = 'No puedes registrar una salida cuando la última acción fue una salida';
      return res.redirect('/dashboard');
    }

    const registro = await Registro.create({
      tipo: 'salida',
      EmpleadoId: empleado.id
    });

    req.session.success = 'Salida registrada correctamente';
    res.redirect('/dashboard');
  } catch (error) {
    req.session.error = error.message;
    res.redirect('/dashboard');
  }
};