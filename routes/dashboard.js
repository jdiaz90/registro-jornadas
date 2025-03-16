// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verificarToken = require('../middlewares/verificarToken');

// Esta ruta está protegida por el middleware verificarToken.
// Si el token es válido, se renderiza la vista dashboard pasándole la información del empleado.
router.get('/', verificarToken, dashboardController.showDashboard);

module.exports = router;
