const express = require('express');
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const {
    indexView,
    loginView,
    signupCenterView,
    signupView,
    dashboardView,
    logout,
    getAdminByEmailPassword,
    batchView,
    batchCreateView,
    createAdmin,
    getAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    createHealtcareCenter,
    getHealtcareCenters,
    getHealtcareCenter,
    updateHealtcareCenter,
    deleteHealtcareCenter,
    createVaccine,
    getVaccines,
    getVaccine,
    updateVaccine,
    deleteVaccine,
    createBatch,
    getBatches,
    getBatch,
    updateBatch,
    deleteBatch,
    createVaccination,
    getVaccinations,
    getVaccination,
    updateVaccination,
    deleteVaccination,
    batchPendingView,
    batchPendingSelectedView,
    batchPendingDetailView,
    batchconfirm,
    batchreject,
    batchAdministered
} = require('../controllers/adminitratorController');

const router = express.Router();

router.get('/admin', indexView);

router.get('/admin-login', loginView);
router.post('/admin-login', urlencodedParser, getAdminByEmailPassword);
router.get('/admin-signup', signupView);
router.post('/admin-signup', urlencodedParser, createAdmin);
router.get('/admin-center', urlencodedParser, signupCenterView);
router.get('/admin-dashboard', urlencodedParser, dashboardView);
router.get('/admin-logout', logout);
router.get('/admin-batch', batchView);
//
router.get('/admin-batch-pending', batchPendingView);
router.get('/admin-batch-selected', batchPendingSelectedView);
router.get('/admin-batch-detail', batchPendingDetailView);
router.get('/admin-batch-confirm', batchconfirm);
router.post('/admin-batch-reject', urlencodedParser, batchreject);
router.post('/admin-batch-administered', urlencodedParser, batchAdministered);
//
router.get('/admin-batch-create', batchCreateView);
router.post('/admin-batch-create', urlencodedParser, createBatch);

router.post('/healtcarecenter', urlencodedParser, createHealtcareCenter);
router.get('/healtcarecenter', getHealtcareCenter);
router.get('/healtcarecenters', getHealtcareCenters);
router.put('/healtcarecenter/:id', urlencodedParser, updateHealtcareCenter);
router.delete('/healtcarecenter/:id', deleteHealtcareCenter);

router.post('/admin', urlencodedParser, createAdmin);
router.get('/admin', getAdmin);
router.get('/admins', getAdmins);
router.put('/admin/:id', urlencodedParser, updateAdmin);
router.delete('/admin/:id', deleteAdmin);

router.post('/vaccine', urlencodedParser, createVaccine);
router.get('/vaccine', getVaccine);
router.get('/vaccines', getVaccines);
router.put('/vaccine/:id', urlencodedParser, updateVaccine);
router.delete('/vaccine/:id', deleteVaccine);

router.post('/batch', urlencodedParser, createBatch);
router.get('/batch', getBatch);
router.get('/batches', getBatches);
router.put('/batch/:id', urlencodedParser, updateBatch);
router.delete('/batch/:id', deleteBatch);

router.post('/vaccination', urlencodedParser, createVaccination);
router.get('/vaccination', getVaccination);
router.get('/vaccinations', getVaccinations);
router.put('/vaccination/:id', urlencodedParser, updateVaccination);
router.delete('/vaccination/:id', deleteVaccination);

function authentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

module.exports = {
    routes: router
}