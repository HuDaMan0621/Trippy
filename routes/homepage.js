var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');

// require Authentication
const checkAuth = require('../auth/checkAuthentication');


/* GET the homepage. */
router.get('/', checkAuth, (req, res, next) => {
    res.render('../Views/homepage.ejs', {
        title: 'HomePage',
        // user: req.session.user || null,
    });
});

module.exports = router;