const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Empleado = require('../models/empleado');
const logger = require('../utils/logger');

exports.showLogin = (req, res) => {
  const error = req.session.error || null;
  req.session.error = null; // Limpiar el mensaje de error después de mostrarlo
  res.render('auth/login', { error, empleado: null });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const now = new Date();
    const localTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Ajuste de +1 hora

    const empleado = await Empleado.findOne({
      where: {
        [Op.or]: [{ dni: identifier }, { email: identifier }]
      }
    });

    if (!empleado) {
      logger.error(`[LOGIN] [${localTime}] Intento fallido: Usuario no encontrado (${identifier})`);
      req.session.error = 'Empleado no encontrado';
      return res.redirect('/auth/login');
    }

    const validPassword = await bcrypt.compare(password, empleado.password);
    if (!validPassword) {
      logger.error(`[LOGIN] [${localTime}] Intento fallido: Contraseña incorrecta para el usuario (${identifier})`);
      req.session.error = 'Contraseña incorrecta';
      return res.redirect('/auth/login');
    }

    const token = jwt.sign(
      { id: empleado.id, nombre: empleado.nombre, dni: empleado.dni },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    logger.info(`[LOGIN] [${localTime}] Inicio de sesión exitoso: Usuario ${empleado.nombre} ${empleado.apellidos} (ID: ${empleado.id})`);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect('/dashboard');
  } catch (error) {
    const now = new Date();
    const localTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Ajuste de +1 hora
    logger.error(`[LOGIN] [${localTime}] Error inesperado: ${error.message}`);
    req.session.error = 'Error al procesar la solicitud';
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};