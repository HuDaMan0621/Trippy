var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');

// require Authentication
const checkAuth = require('../auth/checkAuthentication');


/* GET the homepage. */
router.get('/', checkAuth, (req, res, next) => {
    db.Contents.findAll({
        limit: 10,
        order: [["createdAt", "DESC"]]
    }).then(results => {
        res.render('../Views/homepage.ejs', {
            title: 'HomePage',
            heading: 'Latest Posts',
            user: req.session.user.username,
            posts: results,
        })
    })
});




module.exports = router;