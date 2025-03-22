const Registro = require('../models/registro');
const { Op } = require('sequelize');

exports.showRegistros = async (req, res) => {
  const { mes, año, page = 1, limit = 10 } = req.query; // Página y límite con valores predeterminados
  const empleadoId = req.empleado.id;

  // Filtrar por empleado y, opcionalmente, por mes y año
  let where = { EmpleadoId: empleadoId };
  if (año) {
    if (mes) {
      // Filtrar por mes y año
      where.fechaHora = {
        [Op.between]: [
          new Date(año, mes - 1, 1), // Primer día del mes
          new Date(año, mes, 0),     // Último día del mes
        ],
      };
    } else {
      // Filtrar por todo el año
      where.fechaHora = {
        [Op.between]: [
          new Date(año, 0, 1),       // Primer día del año
          new Date(año, 11, 31, 23, 59, 59), // Último día del año
        ],
      };
    }
  }

  try {
    // Configurar paginación
    const offset = (page - 1) * limit;

    // Obtener registros con paginación
    const { count, rows: registros } = await Registro.findAndCountAll({
      where,
      order: [['fechaHora', 'DESC']], // Ordenar por `fechaHora`
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.render('registros', {
      registros,
      mes,
      año,
      empleado: req.empleado,
      pagination: { page: parseInt(page), totalPages },
      query: req.query,
    });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
};