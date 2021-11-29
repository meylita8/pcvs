const express = require('express');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const {
    indexView,
    loginView,
    signupView,
    dashboardView,
    logout,
    getAdminByEmailPassword,
    createPatient,
    selectHealtcareView,
    createVaccination,
    selectedBatchView,
    selectBatchNoView,
    selectBatchView,
    vaccineAvailableView
} = require('../controllers/patientController');

const router = express.Router();

router.get('/home', indexView);
router.get('/', indexView);
router.get('/login', loginView);
router.post('/login', urlencodedParser, getAdminByEmailPassword);
router.get('/signup', signupView);
router.post('/signup', urlencodedParser, createPatient);
router.get('/dashboard', dashboardView);
router.get('/logout', logout);
router.get('/select-healthcare', selectHealtcareView);
router.post('/patient', urlencodedParser, createPatient);
router.post('/create-vaccination', urlencodedParser, createVaccination);
router.get('/select-batchno', selectBatchNoView);
router.get('/select-batch', selectBatchView);
router.get('/selected-batch', selectedBatchView);
router.get('/vaccine-available', vaccineAvailableView);

module.exports = {
    routes: router
}