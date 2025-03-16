const Registro = require('../models/registro');
const { Op } = require('sequelize');

exports.showRegistros = async (req, res) => {
  const { mes, año } = req.query;
  const empleadoId = req.empleado.id;

  let where = { EmpleadoId: empleadoId };
  if (mes && año) {
    where.createdAt = {
      [Op.between]: [
        new Date(año, mes - 1, 1),
        new Date(año, mes, 0)
      ]
    };
  }

  try {
    const registros = await Registro.findAll({ where, order: [['createdAt', 'ASC']] });

    // Emparejar registros de entrada y salida
    const paresRegistros = [];
    let entrada = null;

    registros.forEach(registro => {
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

    res.render('registros', { paresRegistros, mes, año });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
};