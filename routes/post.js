var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');

// require Authentication
const checkAuth = require('../auth/checkAuthentication');


/* GET the homepage. */
router.get('/', checkAuth, (req, res, next) => {
    res.render('../Views/post.ejs', {
        title: 'New Post',
        user: req.session.user.username,
        // user: req.session.user || null,
    });
});

router.post('/new', (req, res, next) => {
    db.Contents.create({
        UserId: req.session.user.id,
        title: req.body.title,
        body: req.body.body,
    }).then(() => {
        res.redirect('/homepage');
    })
})

//todo implement add new contents 

module.exports = router;