var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const ExifImage = require('exif');


// require Authentication
const checkAuth = require('../auth/checkAuthentication');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './img/profilepictures/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage })

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

router.post('/profilePic', upload.single('profilePic'), (req, res, next) => {
            console.log(req.file);
            const { profilePic } = req.body;
            console.log(profilePic);
            let cookieId = req.session.user.id;
            db.User.update({ picture: req.file.path }, { returning: true, where: { id: cookieId } }
                ).then((result) => {
                    console.log(result);
                    res.redirect('/homepage')
            });
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