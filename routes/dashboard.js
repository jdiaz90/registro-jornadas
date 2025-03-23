const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middlewares/auth'); // Importando el middleware unificado

router.get('/', auth, dashboardController.showDashboard); // Protección con auth
module.exports = router;
