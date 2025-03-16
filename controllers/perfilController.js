const Empleado = require('../models/empleado');
const bcrypt = require('bcrypt');

exports.verPerfil = async (req, res) => {
  try {
    const empleadoId = req.empleado.id;
    const empleado = await Empleado.findByPk(empleadoId);

    if (!empleado) {
      return res.status(404).send('Empleado no encontrado');
    }

    const mensaje = req.session.mensaje || null;
    const tipoMensaje = req.session.tipoMensaje || null;
    req.session.mensaje = null; // Limpiar el mensaje después de mostrarlo
    req.session.tipoMensaje = null; // Limpiar el tipo de mensaje después de mostrarlo

    res.render('perfil', { empleado, mensaje, tipoMensaje });
  } catch (error) {
    console.error('Error al obtener el perfil del empleado:', error);
    res.status(500).send('Error al obtener el perfil del empleado');
  }
};

exports.cambiarContrasena = async (req, res) => {
  try {
    const { nuevaContrasena, confirmarContrasena } = req.body;
    const empleadoId = req.empleado.id;

    if (nuevaContrasena !== confirmarContrasena) {
      req.session.mensaje = 'Las contraseñas no coinciden';
      req.session.tipoMensaje = 'error';
      return res.redirect('/perfil');
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    await Empleado.update({ password: hashedPassword }, { where: { id: empleadoId } });

    req.session.mensaje = 'Contraseña cambiada correctamente';
    req.session.tipoMensaje = 'exito';
    res.redirect('/perfil');
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    req.session.mensaje = 'Error al cambiar la contraseña';
    req.session.tipoMensaje = 'error';
    res.redirect('/perfil');
  }
};