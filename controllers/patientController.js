const firebase = require('../db');
const firestore = firebase.firestore();

const Adminitrator = require('../models/administrator');
const Batch = require('../models/batch');
const HealtcareCenter = require('../models/healtcareCenter');
const Patient = require('../models/patient');
const Vaccination = require('../models/vaccination');
const Vaccine = require('../models/vaccine');
const User = require('../models/user');

// Index Patient
const indexView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            res.render('index');
        } else {
            res.redirect('dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const loginView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            if (req.query.id !== undefined && req.query.vaccineId !== undefined) {
                res.render('login', { id: req.query.id, vaccineId: req.query.vaccineId });
            } else {
                res.render('login', { id: undefined, vaccineId: undefined });
            }
        } else if (req.session.userId !== undefined && req.session.healtcareId !== undefined) {
            if (req.query.id !== undefined && req.query.vaccineId !== undefined) {
                const url = 'select-batchno?id=' + req.query.id + '&vaccineId=' + req.query.vaccineId;
                res.redirect(url);
            }
        } else {
            res.redirect('dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const signupView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            res.render('signup');
        } else {
            res.redirect('dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const dashboardView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            res.redirect('login');
        } else {
            const patient = await firestore.collection('patient').doc(req.session.userId).get();
            if (patient.data() === undefined) {
                res.redirect('admin-dashboard');
            } else {
                res.render('dashboard', { user: patient.data() });
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const logout = async(req, res, next) => {
    try {
        req.session.userId = undefined;
        res.redirect('login');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAdminByEmailPassword = async(req, res, next) => {
    try {
        const patients = await firestore.collection('patient').get();
        if (patients.empty) {
            res.status(404).send('No user');
        } else {
            patients.forEach(doc => {
                if (doc.data().email == req.body.email) {
                    if (doc.data().password == req.body.password) {
                        const patient = new Patient(
                            doc.data().id,
                            doc.data().username,
                            doc.data().password,
                            doc.data().email,
                            doc.data().fullname,
                            doc.data().iCPassprt
                        );
                        req.session.userId = patient.id;
                    }
                }
            });
        }
        if (req.session.healtcareId !== undefined) {
            if (req.body.id !== undefined && req.body.vaccineId !== undefined) {
                const url = 'select-batchno?id=' + req.body.id + '&vaccineId=' + req.body.vaccineId;
                res.redirect(url);
            } else {
                res.redirect('dashboard');
            }
        } else {
            res.redirect('dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const vaccineAvailableView = async(req, res, next) => {
    try {
        const vaccines = await firestore.collection('vaccine').get();
        const vaccineList = [];
        if (vaccines.empty) {
            res.status(404).send('No user');
        } else {
            vaccines.forEach(doc => {
                const vaccine = new Vaccine(
                    doc.data().vaccineId,
                    doc.data().manufacturer,
                    doc.data().vaccineName
                );
                vaccineList.push(vaccine);
            });
            res.render('available-vaccines', {
                vaccineList: vaccineList
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const selectHealtcareView = async(req, res, next) => {
    try {
        const batchs = await firestore.collection('batch').where("vaccineId", "==", req.query.id).get();
        const healtcarecenters = await firestore.collection('healtcarecenter').get();
        const stringHealtcare = [];
        const healtcarecenterList = [];
        if (batchs.empty && healtcarecenters.empty) {
            res.status(404).send('No user');
        } else {
            batchs.forEach(doc => {
                stringHealtcare.push(doc.data().healtCareCenterId);
            });
            healtcarecenters.forEach(doc => {
                stringHealtcare.forEach(element => {
                    if (doc.data().id == element) {
                        const healtcarecenter = new HealtcareCenter(
                            doc.data().id,
                            doc.data().centerName,
                            doc.data().addres
                        );
                        healtcarecenterList.push(healtcarecenter);
                    }
                });
            });
            res.render('patient-healthcare', {
                healtcarecenterList: healtcarecenterList,
                vaccineId: req.query.id
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const selectBatchView = async(req, res, next) => {
    try {
        const batchs = await firestore.collection('batch').where("healtCareCenterId", "==", req.query.id).get();
        const batchList = [];
        if (batchs.empty) {
            res.redirect('select-healthcare?id=' + req.session.healtcareId);
        } else {
            batchs.forEach(doc => {
                if (doc.data().vaccineId == req.query.vaccineId) {
                    const batch = new Batch(
                        doc.data().id,
                        doc.data().batchNo,
                        doc.data().expiryDate,
                        doc.data().quantityAvailable,
                        doc.data().quantityAdministered
                    );
                    batchList.push(batch);
                    req.session.healtcareId = req.query.id;
                }
            });
            res.render('patient-batch', {
                batchList: batchList,
                healtCareCenterId: req.query.id,
                vaccineId: req.query.vaccineId,
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const selectBatchNoView = async(req, res, next) => {
    try {
        const patient = await firestore.collection('patient').doc(req.session.userId).get();
        const batchs = await firestore.collection('batch').where("healtCareCenterId", "==", req.query.id).get();
        const batchList = [];
        if (batchs.empty) {
            res.status(404).send('No user');
        } else {
            batchs.forEach(doc => {
                if (doc.data().vaccineId == req.query.vaccineId) {
                    const batch = new Batch(
                        doc.data().id,
                        doc.data().batchNo,
                        doc.data().expiryDate,
                        doc.data().quantityAvailable,
                        doc.data().quantityAdministered
                    );
                    batchList.push(batch);
                }
            });
            console.log(patient.data());
            res.render('patient-batchno', {
                batchList: batchList,
                patient: patient.data()
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const selectedBatchView = async(req, res, next) => {
    try {
        if (req.session.userId !== undefined) {
            const batch = await firestore.collection('batch').doc(req.query.id).get();
            res.render('patient-batch-selected', {
                batch: batch.data(),
                patient: req.session.userId
            });
        } else {
            res.redirect('login');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const createVaccination = async(req, res, next) => {
    try {
        const batch = await firestore.collection('batch').doc(req.body.batchId).get();
        var d1 = Date.parse(batch.data().expiryDate);
        var d2 = Date.parse(req.body.appointmentDate);
        if (d2 > d1) {
            const url = 'selected-batch?id=' + req.body.batchId;
            res.redirect(url);
        } else {
            const { path } = await firestore.collection('vaccination').add(req.body);
            await firestore.collection('vaccination').doc(path.split("/")[1]).update({ vaccinationId: path.split("/")[1] });
            const quatity = batch.data().quantityAvailable - 1;
            await firestore.collection('batch').doc(req.body.batchId).update({ quantityAvailable: quatity });
            res.redirect('/home')
        }
    } catch {
        res.redirect('/')
    }
}

// Patient CRUD
const createPatient = async(req, res, next) => {
    try {
        const { path } = await firestore.collection('patient').add(req.body);
        req.session.userId = path.split("/")[1];
        await firestore.collection('patient').doc(req.session.userId).update({ id: req.session.userId });
        res.redirect('dashboard')
    } catch {
        res.redirect('dashboard')
    }
}

module.exports = {
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
}