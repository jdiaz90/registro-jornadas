// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarNoAutenticado = require('../middlewares/verificarNoAutenticado');

router.get('/login', verificarNoAutenticado, authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;