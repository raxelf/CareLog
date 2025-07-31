const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

const isLoggedIn = function(req, res, next) {
    if(!req.session.userId && !req.session.role) {
        const error = "Akses ditolak. Silakan login terlebih dahulu";

        res.redirect(`/login?error=${error}`)
    } else {
        next();
    }
}

const isPatient = function(req, res, next) {
    if (req.session.role === 'patient') {
        next();
    } else {
        res.redirect('/doctor')
    }
}

const isDoctor = function(req, res, next) {
    if (req.session.role === 'doctor') {
        next();
    } else {
        res.redirect('/patient')
    }
}

const notLoggedIn = function (req, res, next) {
    if(!req.session.userId && !req.session.role) {
        next();
    } else {
        if (req.session.role === 'patient') {
            res.redirect('/patient');
        } else if (req.session.role === 'doctor') {
            res.redirect('/doctor');
        }
    }
}

router.get('/', notLoggedIn, Controller.getHome);

// Auth
router.get('/login', notLoggedIn, Controller.getLogin);
router.post('/login', notLoggedIn, Controller.login);
router.get('/register', notLoggedIn, Controller.getRegister);
router.post('/register', notLoggedIn, Controller.registerPatient);
router.get('/logout', isLoggedIn, Controller.logout);

// Patient
router.get('/patient', isLoggedIn, isPatient, Controller.getPatientDashboard);
router.get('/patient/queue', isLoggedIn, isPatient, Controller.getPatientQueue);
router.post('/patient/queue', isLoggedIn, isPatient, Controller.X);
router.get('/patient/history', isLoggedIn, isPatient, Controller.getPatientHistory);
router.get('/patient/history/:historyId/prescription', isLoggedIn, isPatient, Controller.X);

// Doctor
router.get('/doctor', isLoggedIn, isDoctor, Controller.getDoctorDashboard);
router.get('/doctor/queue', isLoggedIn, isDoctor, Controller.getDoctorQueue);
router.get('/doctor/history', isLoggedIn, isDoctor, Controller.getDoctorHistory);
router.get('/doctor/emr', isLoggedIn, isDoctor, Controller.getDoctorEmrRequest);


module.exports = router;