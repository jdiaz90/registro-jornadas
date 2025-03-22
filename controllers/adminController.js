const Empleado = require('../models/empleado');
const Registro = require('../models/registro');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const fs = require('fs'); // Para registrar errores en un archivo de log

exports.verEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();

    // Pasar mensaje de sesión y empleado autenticado a la vista
    const mensaje = req.session.mensaje || null;
    const tipoMensaje = req.session.tipoMensaje || null;

    // Limpiar mensaje de sesión
    req.session.mensaje = null;
    req.session.tipoMensaje = null;

    res.render('admin/empleados', {
      empleados,
      mensaje,
      tipoMensaje,
      empleado: req.empleado, // Pasar el empleado autenticado
    });
  } catch (error) {
    console.error('Error al obtener la lista de empleados:', error);
    res.status(500).send('Error al obtener la lista de empleados.');
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

exports.mostrarFormularioAlta = (req, res) => {
  res.render('admin/altaEmpleado', {
    empleadoAdmin: req.empleado, // Pasar el empleado autenticado
    mensaje: req.session.mensaje || null,
    tipoMensaje: req.session.tipoMensaje || null,
    valoresPrevios: req.session.valoresPrevios || {},
  });

  // Limpiar mensaje de sesión
  req.session.mensaje = null;
  req.session.tipoMensaje = null;
  req.session.valoresPrevios = null;
};

exports.crearEmpleado = async (req, res) => {
  const { dni, nombre, apellidos, email, puesto, isAdmin, password } = req.body;

  try {
    // Verificar si el DNI o el correo ya están en uso
    const empleadoExistente = await Empleado.findOne({
      where: {
        [Sequelize.Op.or]: [{ dni }, { email }]
      }
    });

    if (empleadoExistente) {
      const mensajeError =
        empleadoExistente.dni === dni
          ? 'El DNI ya está en uso.'
          : 'El correo electrónico ya está en uso.';

      req.session.mensaje = mensajeError;
      req.session.tipoMensaje = 'error';
      req.session.valoresPrevios = { dni, nombre, apellidos, email, puesto, isAdmin };
      return res.redirect('/admin/empleados/nuevo');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo empleado
    await Empleado.create({
      dni,
      nombre,
      apellidos,
      email,
      puesto,
      isAdmin: isAdmin === 'true',
      password: hashedPassword
    });

    // Mensaje de éxito
    req.session.mensaje = 'Empleado creado correctamente.';
    req.session.tipoMensaje = 'success';
    res.redirect('/admin/empleados');
  } catch (error) {
    console.error('Error al crear el empleado:', error);

    req.session.mensaje = 'Ocurrió un error al intentar crear el empleado.';
    req.session.tipoMensaje = 'error';
    req.session.valoresPrevios = { dni, nombre, apellidos, email, puesto, isAdmin };
    res.redirect('/admin/empleados/nuevo');
  }
};

exports.mostrarFormularioEdicion = async (req, res) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      req.session.mensaje = 'Empleado no encontrado.';
      req.session.tipoMensaje = 'error';
      return res.redirect('/admin/empleados');
    }

    res.render('admin/editarEmpleado', {
      empleadoAdmin: req.empleado,
      empleado,
      mensaje: req.session.mensaje || null,
      tipoMensaje: req.session.tipoMensaje || null,
    });

    // Limpiar mensaje de sesión
    req.session.mensaje = null;
    req.session.tipoMensaje = null;
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error);
    req.session.mensaje = 'Ocurrió un error al cargar el formulario de edición.';
    req.session.tipoMensaje = 'error';
    res.redirect('/admin/empleados');
  }
};

exports.editarEmpleado = async (req, res) => {
  const { id } = req.params;
  const { dni, nombre, apellidos, email, puesto, isAdmin, password } = req.body;

  try {
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      req.session.mensaje = 'Empleado no encontrado.';
      req.session.tipoMensaje = 'error';
      return res.redirect('/admin/empleados');
    }

    // Verificar si el DNI o el correo ya están en uso por otro usuario
    const empleadoExistente = await Empleado.findOne({
      where: {
        [Sequelize.Op.or]: [{ dni }, { email }],
        id: { [Sequelize.Op.ne]: id }, // Excluir el usuario actual
      },
    });

    if (empleadoExistente) {
      const mensajeError =
        empleadoExistente.dni === dni
          ? 'El DNI ya está en uso.'
          : 'El correo electrónico ya está en uso.';

      req.session.mensaje = mensajeError;
      req.session.tipoMensaje = 'error';
      return res.redirect(`/admin/empleados/${id}/editar`);
    }

    // Actualizar los datos del empleado
    empleado.dni = dni;
    empleado.nombre = nombre;
    empleado.apellidos = apellidos;
    empleado.email = email;
    empleado.puesto = puesto;
    empleado.isAdmin = isAdmin === 'true';

    // Si se proporciona una nueva contraseña, actualizarla
    if (password) {
      empleado.password = await bcrypt.hash(password, 10);
    }

    await empleado.save();

    req.session.mensaje = 'Empleado actualizado correctamente.';
    req.session.tipoMensaje = 'success';
    res.redirect('/admin/empleados');
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    req.session.mensaje = 'Ocurrió un error al intentar actualizar el empleado.';
    req.session.tipoMensaje = 'error';
    res.redirect(`/admin/empleados/${id}/editar`);
  }
};