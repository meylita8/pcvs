'use strict';
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const adminRoutes = require('./routes/administrator-routes');
const patientRoutes = require('./routes/patient-routes');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs = require('fs');

const app = express();

app.use(expressLayouts);
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(flash())
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

app.use(adminRoutes.routes);
app.use(patientRoutes.routes);
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', urlencodedParser, checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}))

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(config.port, () => console.log('App is listening on url http://localhost:' + config.port));