const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', verificarToken, registrosController.showRegistros);

module.exports = router;