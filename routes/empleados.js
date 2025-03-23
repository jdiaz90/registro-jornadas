// routes/empleados.js
const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const verificarToken = require('../middlewares/verificarToken');

// Ruta unificada para entrada y salida
router.post('/:id/registro', verificarToken, empleadoController.registrarEntradaSalida);


module.exports = router;
