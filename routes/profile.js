var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');

// require Authentication
const checkAuth = require('../auth/checkAuthentication');


/* GET the homepage. */
router.get('/', checkAuth, (req, res, next) => {
    res.render('../Views/profile.ejs', {
        title: 'profile',
        user: req.session.user.username,
        // user: req.session.user || null,
    });
});

//todo implement changing pw 

module.exports = router;