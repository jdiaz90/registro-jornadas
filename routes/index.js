const express = require('express');
const router = express.Router();

const registrosRouter = require('./registros');
const perfilRouter = require('./perfil');
const empleadosRouter = require('./empleados');
const dashboardRouter = require('./dashboard');
const authRouter = require('./auth');
const adminRouter = require('./admin');

router.use('/registros', registrosRouter);
router.use('/perfil', perfilRouter);
router.use('/api/empleados', empleadosRouter);
router.use('/dashboard', dashboardRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);

router.get('/', (req, res) => {
  res.redirect('/auth/login');
});

module.exports = router;