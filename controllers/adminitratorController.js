const firebase = require('../db');
const firestore = firebase.firestore();

const Adminitrator = require('../models/administrator');
const Batch = require('../models/batch');
const HealtcareCenter = require('../models/healtcareCenter');
const Patient = require('../models/patient');
const Vaccination = require('../models/vaccination');
const Vaccine = require('../models/vaccine');
const User = require('../models/user');

// Index Admin
const indexView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            res.render('admin-index');
        } else {
            res.redirect('admin-dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const loginView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            res.render('admin-login');
        } else {
            res.redirect('admin-dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const signupCenterView = async(req, res, next) => {
    try {
        const healtcareCenters = await firestore.collection('healtcarecenter').get();
        const healtcareCenterList = [];
        if (healtcareCenters.empty) {
            res.status(404).send('No user');
        } else {
            healtcareCenters.forEach(doc => {
                const healtcareCenter = new HealtcareCenter(
                    doc.data().id,
                    doc.data().centerName,
                    doc.data().addres
                );
                healtcareCenterList.push(healtcareCenter);
            });
            res.render('admin-center', { healtcareCenterList: healtcareCenterList });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const signupView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            const center = await firestore.collection('healtcarecenter').doc(req.query.id).get();
            console.log(center.data());
            res.render('admin-signup', { center: center.data() });
        } else {
            res.redirect('admin-dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const dashboardView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            res.redirect('admin-login');
        } else {
            const admin = await firestore.collection('admin').doc(req.session.userId).get();
            res.render('admin-dashboard', { user: admin.data() });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const logout = async(req, res, next) => {
    try {
        req.session.userId = undefined;
        res.redirect('admin-login');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAdminByEmailPassword = async(req, res, next) => {
    try {
        const admins = await firestore.collection('admin').get();
        if (admins.empty) {
            res.status(404).send('No user');
        } else {
            admins.forEach(doc => {
                if (doc.data().email == req.body.email) {
                    if (doc.data().password == req.body.password) {
                        const admin = new Adminitrator(
                            doc.data().id,
                            doc.data().username,
                            doc.data().password,
                            doc.data().email,
                            doc.data().fullname,
                            doc.data().staffID
                        );
                        req.session.userId = admin.id;
                    }
                }
            });
        }
        res.redirect('admin-dashboard');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const batchView = async(req, res, next) => {
    try {
        if (req.session.userId === undefined) {
            res.redirect('admin-login');
        } else {
            const admin = await firestore.collection('admin').doc(req.session.userId).get();
            console.log(admin.data());
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
                res.render('admin-batch-vaccine', {
                    user: admin.data(),
                    vaccineList: vaccineList
                });
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const batchCreateView = async(req, res, next) => {
    try {
        if (req.session.userId !== undefined) {
            const vaccine = await firestore.collection('vaccine').doc(req.query.id).get();
            res.render('admin-batch', { vaccine: vaccine.data(), healtcare: req.query.healtcare });
        } else {
            res.redirect('admin-dashboard');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Admin CRUD
const createAdmin = async(req, res, next) => {
    try {
        const { path } = await firestore.collection('admin').add(req.body);
        req.session.userId = path.split("/")[1];
        await firestore.collection('admin').doc(req.session.userId).update({ id: req.session.userId });
        res.redirect('/admin-dashboard')
    } catch {
        res.redirect('/admin-dashboard')
    }
}

const getAdmins = async(req, res, next) => {
    try {
        const admins = await firestore.collection('admin').get();
        const adminList = [];
        if (admins.empty) {
            res.status(404).send('No user');
        } else {
            admins.forEach(doc => {
                const admin = new Adminitrator(
                    doc.data().id,
                    doc.data().username,
                    doc.data().password,
                    doc.data().email,
                    doc.data().fullname,
                    doc.data().staffID
                );
                adminList.push(admin);
            });
            res.send(adminList);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAdmin = async(req, res, next) => {
    try {
        const admin = await firestore.collection('admin').doc(req.params.id).get();
        if (!admin.exists) {
            res.status(404).send('Account not found');
        } else {
            res.send(admin.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateAdmin = async(req, res, next) => {
    try {
        await firestore.collection('admin').doc(req.params.id).update(req.body);
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteAdmin = async(req, res, next) => {
    try {
        await firestore.collection('admin').doc(req.params.id).delete();
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// HealtcareCenter CRUD
const createHealtcareCenter = async(req, res, next) => {
    try {
        const { path } = await firestore.collection('healtcarecenter').add(req.body);
        const id = path.split("/")[1]
        await firestore.collection('admin').doc(id).update({ id: id });
        res.redirect('/admin')
    } catch {
        res.redirect('/admin')
    }
}

const getHealtcareCenters = async(req, res, next) => {
    try {
        const healtcareCenters = await firestore.collection('healtcarecenter').get();
        const healtcareCenterList = [];
        if (healtcareCenters.empty) {
            res.status(404).send('No user');
        } else {
            healtcareCenters.forEach(doc => {
                const healtcareCenter = new HealtcareCenter(
                    doc.data().id,
                    doc.data().centerName,
                    doc.data().addres
                );
                healtcareCenterList.push(healtcareCenter);
            });
            res.send(healtcareCenterList);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getHealtcareCenter = async(req, res, next) => {
    try {
        const healtcarecenter = await firestore.collection('healtcarecenter').doc(req.params.id).get();
        if (!healtcarecenter.exists) {
            res.status(404).send('Account not found');
        } else {
            res.send(healtcarecenter.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateHealtcareCenter = async(req, res, next) => {
    try {
        await firestore.collection('healtcarecenter').doc(req.params.id).update(req.body);
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteHealtcareCenter = async(req, res, next) => {
    try {
        await firestore.collection('healtcarecenter').doc(req.params.id).delete();
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Vaccine CRUD
const createVaccine = async(req, res, next) => {
    try {
        await firestore.collection('vaccine').doc().set(req.body);
        res.redirect('/login')
    } catch {
        res.redirect('/')
    }
}

const getVaccines = async(req, res, next) => {
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
            res.send(vaccineList);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getVaccine = async(req, res, next) => {
    try {
        const vaccine = await firestore.collection('vaccine').doc(req.params.id).get();
        if (!vaccine.exists) {
            res.status(404).send('Account not found');
        } else {
            res.send(vaccine.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateVaccine = async(req, res, next) => {
    try {
        await firestore.collection('vaccine').doc(req.params.id).update(req.body);
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteVaccine = async(req, res, next) => {
    try {
        await firestore.collection('vaccine').doc(req.params.id).delete();
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Batch CRUD
const createBatch = async(req, res, next) => {
    try {
        const { path } = await firestore.collection('batch').add(req.body);
        await firestore.collection('batch').doc(path.split("/")[1]).update({ id: path.split("/")[1] });
        res.redirect('/admin-dashboard')
    } catch {
        res.redirect('/')
    }
}

const getBatches = async(req, res, next) => {
    try {
        const batches = await firestore.collection('batch').get();
        const batchList = [];
        if (batches.empty) {
            res.status(404).send('No user');
        } else {
            batches.forEach(doc => {
                const batch = new Batch(
                    doc.data().vaccineId,
                    doc.data().batchNo,
                    doc.data().expiryDate,
                    doc.data().quantityAvailable,
                    doc.data().quantityAdministered
                );
                batchList.push(batch);
            });
            res.send(batchList);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getBatch = async(req, res, next) => {
    try {
        const batch = await firestore.collection('batch').doc(req.params.id).get();
        if (!batch.exists) {
            res.status(404).send('Account not found');
        } else {
            res.send(batch.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateBatch = async(req, res, next) => {
    try {
        await firestore.collection('batch').doc(req.params.id).update(req.body);
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteBatch = async(req, res, next) => {
    try {
        await firestore.collection('batch').doc(req.params.id).delete();
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Vaccination CRUD
const createVaccination = async(req, res, next) => {
    try {
        await firestore.collection('vaccination').doc().set(req.body);
        res.redirect('/login')
    } catch {
        res.redirect('/')
    }
}

const getVaccinations = async(req, res, next) => {
    try {
        const vaccinations = await firestore.collection('vaccination').get();
        const vaccinationList = [];
        if (vaccinations.empty) {
            res.status(404).send('No user');
        } else {
            vaccinations.forEach(doc => {
                const vaccination = new Vaccination(
                    doc.data().vaccinationId,
                    doc.data().appointmentDate,
                    doc.data().status,
                    doc.data().remark
                );
                vaccinationList.push(vaccination);
            });
            res.send(vaccinationList);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getVaccination = async(req, res, next) => {
    try {
        const vaccination = await firestore.collection('vaccination').doc(req.params.id).get();
        if (!vaccination.exists) {
            res.status(404).send('Account not found');
        } else {
            res.send(vaccination.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateVaccination = async(req, res, next) => {
    try {
        await firestore.collection('vaccination').doc(req.params.id).update(req.body);
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteVaccination = async(req, res, next) => {
    try {
        await firestore.collection('vaccination').doc(req.params.id).delete();
        res.redirect('/admin');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
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
    deleteVaccination
}