const Registro = require('../models/registro');
const { Op } = require('sequelize');

exports.showRegistros = async (req, res) => {
  const { mes, año, page = 1, limit = 50 } = req.query; // Página y límite con valores predeterminados
  const empleadoId = req.empleado.id;

  let where = { EmpleadoId: empleadoId };
  if (mes && año) {
    where.createdAt = {
      [Op.between]: [
        new Date(año, mes - 1, 1),
        new Date(año, mes, 0),
      ],
    };
  }

  try {
    // Configurar paginación
    const offset = (page - 1) * limit;

    // Obtener registros con paginación
    const { count, rows: registros } = await Registro.findAndCountAll({
      where,
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Emparejar registros de entrada y salida
    const paresRegistros = [];
    let entrada = null;

    registros.forEach((registro) => {
      if (registro.tipo === 'entrada') {
        if (entrada) {
          // Si ya hay una entrada sin emparejar, agregarla sin salida
          paresRegistros.push({ entrada, salida: null });
        }
        entrada = registro;
      } else if (registro.tipo === 'salida' && entrada) {
        paresRegistros.push({ entrada, salida: registro });
        entrada = null;
      }
    });

    // Si queda una entrada sin emparejar, agregarla sin salida
    if (entrada) {
      paresRegistros.push({ entrada, salida: null });
    }

    paresRegistros.reverse(); // Mostrar los registros más recientes primero

    const totalPages = Math.ceil(count / limit);

    res.render('registros', {
      paresRegistros,
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