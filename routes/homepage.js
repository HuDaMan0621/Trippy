var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');

// require Authentication
const checkAuth = require('../auth/checkAuthentication');


/* GET the homepage. */
router.get('/', checkAuth, (req, res, next) => {
    db.Contents.findAll().then(results => {
        res.render('../Views/homepage.ejs', {
            title: 'HomePage',
            user: req.session.user.username,
            posts: results,             
        })
    });  

    
});

// router.get('/', function (req, res, next) {
//     // res.send('hello');
//     res.render('../views/homepage', {

//             });
// });

module.exports = router;