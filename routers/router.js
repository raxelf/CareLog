const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

router.get('/', Controller.getHome);
router.get('/login', Controller.getLogin);

module.exports = router;