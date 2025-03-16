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
      return res.status(403).json({ error: 'No estás autorizado para fichar en nombre de otro empleado' });
    }

    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    const registro = await Registro.create({
      tipo: 'entrada',
      EmpleadoId: empleado.id
    });

    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registrarSalida = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.empleado.id) {
      return res.status(403).json({ error: 'No estás autorizado para fichar en nombre de otro empleado' });
    }

    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    const registro = await Registro.create({
      tipo: 'salida',
      EmpleadoId: empleado.id
    });

    res.json(registro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};