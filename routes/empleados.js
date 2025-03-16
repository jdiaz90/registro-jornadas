// routes/empleados.js
const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const verificarToken = require('../middlewares/auth');

router.post('/', empleadoController.createEmpleado);
router.post('/:id/entrada', verificarToken, empleadoController.registrarEntrada);
router.post('/:id/salida', verificarToken, empleadoController.registrarSalida);

module.exports = router;
