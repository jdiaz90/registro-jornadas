const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Importando el middleware unificado

const registrosRouter = require('./registros');
const perfilRouter = require('./perfil');
const empleadosRouter = require('./empleados');
const dashboardRouter = require('./dashboard');
const authRouter = require('./auth');
const adminRouter = require('./admin');

router.use('/registros', auth, registrosRouter); // Protección con auth
router.use('/perfil', auth, perfilRouter);     // Protección con auth
router.use('/api/empleados', auth, empleadosRouter); // Protección con auth
router.use('/dashboard', auth, dashboardRouter); // Protección con auth
router.use('/auth', authRouter); // Excepción: /auth no necesita autenticación
router.use('/admin', auth, adminRouter); // Protección con auth

router.get('/', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = router;
