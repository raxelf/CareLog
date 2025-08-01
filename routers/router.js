const express = require('express');
const Controller = require('../controllers/controller');
const { notLoggedIn, isLoggedIn, isPatient, isDoctor } = require('../middlewares/auth');
const router = express.Router();

router.get('/', notLoggedIn, Controller.getHome);

// Auth
router.get('/login', notLoggedIn, Controller.getLogin);
router.post('/login', notLoggedIn, Controller.login);
router.get('/register', notLoggedIn, Controller.getRegister);
router.post('/register', notLoggedIn, Controller.registerPatient);
router.get('/logout', Controller.logout);

// Patient
router.get('/patient', isLoggedIn, isPatient, Controller.getPatientDashboard);
router.get('/patient/queue', isLoggedIn, isPatient, Controller.getPatientQueue);
router.post('/patient/queue', isLoggedIn, isPatient, Controller.savePatientQueue);
router.get('/patient/history', isLoggedIn, isPatient, Controller.getPatientHistory);
router.get('/patient/history/:historyId/prescription', isLoggedIn, isPatient, Controller.X);
router.get('/patient/history/emrRequest/:id', isLoggedIn, isPatient, Controller.getPatientEmrRequest);

// Doctor
router.get('/doctor', isLoggedIn, isDoctor, Controller.getDoctorDashboard);
router.get('/doctor/queue', isLoggedIn, isDoctor, Controller.getDoctorQueue);
router.get('/doctor/queue/:id/diagnose', isLoggedIn, isDoctor, Controller.getDoctorQueueDiagnose);
router.post('/doctor/queue/:id/diagnose', isLoggedIn, isDoctor, Controller.saveDoctorQueueDiagnose);
router.get('/doctor/history', isLoggedIn, isDoctor, Controller.getDoctorHistory);
router.get('/doctor/emr', isLoggedIn, isDoctor, Controller.getDoctorEmrRequest);
router.get('/doctor/emr/:id/accept', isLoggedIn, isDoctor, Controller.getEmrAccept);

router.get('/emr/:id/downloadpdf', isLoggedIn, Controller.donwloadEmrPdf)

module.exports = router;