var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');

// require Authentication
const checkAuth = require('../auth/checkAuthentication');


/* GET the homepage. */
router.get('/', checkAuth, (req, res, next) => {
    db.User.findByPk(req.session.user.id)
        .then((results) => {
            res.render('../Views/profile.ejs', {
                title: 'profile',
                user: req.session.user.username,
                userData: results
            });
        })
});

//todo implement changing pw 
router.post('/newPassword', checkAuth, (req, res, next) => {
    let cookiePassword = req.session.user.password;
    let cookieId = req.session.user.id;
    // console.log(req.session.user);
    // console.log(cookiePassword);
    bcrypt.compare(req.body.currentPassword, cookiePassword, (err, match) => {
        // console.log('true')
        if (match) {
            // console.log('match')
            bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                db.User.update({ password: hash }, { returning: true, where: { id: cookieId } }
                ).then((result) => {
                    // console.log(result);
                    res.redirect('/homepage')
                })
            })
        }
    }
    )
})

module.exports = router;