const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verificarToken = require('../middlewares/verificarToken');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.get('/empleados', verificarToken, verificarAdmin, adminController.verEmpleados);

module.exports = router;