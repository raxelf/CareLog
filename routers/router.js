const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

router.get('/', Controller.getHome);

// Auth
router.get('/login', Controller.getLogin);
router.post('/login', Controller.X);
router.get('/register', Controller.getRegister);
router.post('/register', Controller.X);

// Patient
router.get('/patient', Controller.getPatientDashboard);
router.get('/patient/queue', Controller.getPatientQueue);
router.post('/patient/queue', Controller.X);
router.get('/patient/history', Controller.getPatientHistory);

// Doctor
router.get('/doctor', Controller.getDoctorDashboard);
router.get('/doctor/queue', Controller.getDoctorQueue);
router.get('/doctor/history', Controller.getDoctorHistory);
router.get('/doctor/emr', Controller.getDoctorEmrRequest);


module.exports = router;