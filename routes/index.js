const express = require('express');
const router = express.Router();

const registrosRouter = require('./registros');
const perfilRouter = require('./perfil');
const empleadosRouter = require('./empleados');
const dashboardRouter = require('./dashboard');
const authRouter = require('./auth');

router.use('/registros', registrosRouter);
router.use('/perfil', perfilRouter);
router.use('/api/perfil', perfilRouter); // Añadir esta línea para la API de cambio de contraseña
router.use('/api/empleados', empleadosRouter);
router.use('/dashboard', dashboardRouter);
router.use('/auth', authRouter);

module.exports = router;