const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

router.get('/', Controller.getHome);

// Auth
router.get('/login', Controller.getLogin);
router.post('/login', Controller.X);
router.get('/register', Controller.getRegister);
router.post('/register', Controller.X);

router.get('/patient', Controller.getPatientDashboard);
router.get('/patient/queue', Controller.getPatientQueue);
router.get('/patient/history', Controller.getPatientHistory);


module.exports = router;