const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');
const auth = require('../middlewares/auth'); // Importando el middleware unificado

router.post('/:id/registro', auth, empleadoController.registrarEntradaSalida);
module.exports = router;
