const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Empleado = require('../models/empleado');

exports.showLogin = (req, res) => {
  res.render('login');
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
      return res.render('login', { error: 'Empleado no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, empleado.password);
    if (!validPassword) {
      return res.render('login', { error: 'Contraseña incorrecta' });
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
    res.render('login', { error: 'Error al procesar la solicitud' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};