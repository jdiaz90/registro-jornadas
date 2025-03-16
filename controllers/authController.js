const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Empleado = require('../models/empleado');

exports.showLogin = (req, res) => {
  const error = req.session.error || null;
  req.session.error = null; // Limpiar el mensaje de error después de mostrarlo
  res.render('login', { error });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  
  try {
    const empleado = await Empleado.findOne({
      where: {
        [Op.or]: [{ dni: identifier }, { email: identifier }]
      }
    });

    if (!empleado) {
      req.session.error = 'Empleado no encontrado';
      return res.redirect('/login');
    }

    const validPassword = await bcrypt.compare(password, empleado.password);
    if (!validPassword) {
      req.session.error = 'Contraseña incorrecta';
      return res.redirect('/login');
    }

    const token = jwt.sign(
      { id: empleado.id, nombre: empleado.nombre, dni: empleado.dni },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error en el login:', error);
    req.session.error = 'Error al procesar la solicitud';
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};