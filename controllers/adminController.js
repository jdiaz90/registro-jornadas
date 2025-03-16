const Empleado = require('../models/empleado');

exports.verEmpleados = async (req, res) => {
  try {
    const sort = req.query.sort || 'id';
    const order = req.query.order || 'asc';

    const empleados = await Empleado.findAll({
      order: [[sort, order]]
    });

    res.render('admin/empleados', { empleados, empleado: req.empleado, sort, order });
  } catch (error) {
    console.error('Error al obtener la lista de empleados:', error);
    res.status(500).send('Error al obtener la lista de empleados');
  }
};