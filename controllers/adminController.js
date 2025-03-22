const Empleado = require('../models/empleado');
const Registro = require('../models/registro');

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

exports.verRegistrosEmpleado = async (req, res) => {
  try {
    const empleadoId = req.params.id;
    const { mes, año } = req.query;

    // Verificar si el empleado existe
    const empleado = await Empleado.findByPk(empleadoId);
    if (!empleado) {
      req.session.mensaje = 'Empleado no encontrado';
      req.session.tipoMensaje = 'error';
      return res.redirect('/admin/empleados');
    }

    // Filtrar registros por mes y año si se proporcionan
    let where = { EmpleadoId: empleadoId };
    if (mes && año) {
      where.fechaHora = {
        [Op.between]: [
          new Date(año, mes - 1, 1),
          new Date(año, mes, 0),
        ],
      };
    }

    // Obtener los registros del empleado
    const registros = await Registro.findAll({
      where,
      order: [['fechaHora', 'ASC']],
    });

    res.render('admin/registros', { empleado, registros, mes, año, empleadoAdmin: req.empleado });
  } catch (error) {
    console.error('Error al obtener los registros del empleado:', error);
    req.session.mensaje = 'Error al obtener los registros del empleado';
    req.session.tipoMensaje = 'error';
    res.redirect('/admin/empleados');
  }
};

// Descargar registros en PDF
exports.descargarRegistrosPDF = async (req, res) => {
  try {
    const empleadoId = req.params.id;
    const registros = await Registro.findAll({ where: { EmpleadoId: empleadoId } });

    const pdfBuffer = await generarPDF(registros);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="registros-${empleadoId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
};

// Descargar registros en Excel
exports.descargarRegistrosExcel = async (req, res) => {
  try {
    const empleadoId = req.params.id;
    const registros = await Registro.findAll({ where: { EmpleadoId: empleadoId } });

    const excelBuffer = await generarExcel(registros);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="registros-${empleadoId}.xlsx"`);
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error al generar el Excel:', error);
    res.status(500).send('Error al generar el Excel');
  }
};