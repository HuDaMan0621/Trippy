var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const ExifImage = require('exif');
var Jimp = require('jimp');


// require Authentication
const checkAuth = require('../auth/checkAuthentication');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/profilepictures/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload an image.', 400), false);
    }
};


var upload = multer({ storage: storage, fileFilter: multerFilter });

/* GET the homepage. */
router.get('/', checkAuth, (req, res, next) => {
    console.log(req.session.user.picture);
    db.User.findByPk(req.session.user.id)
        .then((results) => {
            console.log(results)
            console.log(req.session.user.id)
            res.render('profile.ejs', {
                title: 'profile',
                user: req.session.user.username,
                userData: results,
                avatar: results.picture
            });
        })
});

router.post('/profilePic', upload.single('profilePic'), (req, res, next) => {
    console.log(req.file);
    let profilePath = `/img/profilepictures/${req.file.filename}`;
    const { profilePic } = req.body;
    console.log(profilePic)
    req.session.user.avatar = profilePath;
    let cookieId = req.session.user.id;
    Jimp.read(req.file.path)
        .then(img => {
            return img
                // .scaleToFit(400, 400)
                .resize(100, 100) // resize
                .quality(60) // set JPEG quality
                .write(`./public/img/profilepictures/${req.file.filename}`); // save
        })
        .catch(err => {
            console.error(err);
        });
    db.User.update({ picture: profilePath }, { returning: true, where: { id: cookieId } }
    ).then((result) => {
        console.log(result);
        res.redirect('/profile')
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