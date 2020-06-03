const {QueryTypes, query, Op} = require('sequelize');
const db = require('../models')
const bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();
var Jimp = require('jimp');
require('dotenv').config();
const URL = process.env.DATABASE_URL

// image upload
// upload an image
const fs = require('fs');
const path = require('path');
var multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/contentsImages/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({ storage: storage })
// const sequelize = new Sequelize('travelblog',
//     'postgres',
//     'postgres', {
//     host: URL,
//     dialect: 'postgres',
//     logging: console.log,
//     freezeTableName: true,

//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// })

// require Authentication
const checkAuth = require('../auth/checkAuthentication');

router.post('/comment/new', checkAuth, (req, res, next) => {
    contentId = req.body.blogid;
    console.log(req.session.user.id)
    console.log(req.session.user.username)
    console.log(req.session.user);
    console.log(req.session.user.avatar)
    db.User.findByPk(req.session.user.id)
        .then((userInfo) => {
            db.Comments.create({
                UserId: req.session.user.id,
                ContentId: req.body.blogid,
                body: req.body.commentbody,
                content_id: req.session.user.username,
                avatar: userInfo.picture
            })
        })
        .then(() => {
            res.redirect(`/post/id/${contentId}`)
        })
})

// get blog post by id // this is a public route
router.get('/id/:id', (req, res, next) => {
    let auth = false;
    if (req.session.user) {
        auth = true;
    }
    db.Contents.findByPk(req.params.id)
        .then((blogPost) => {  // get the blog post 
            console.log(blogPost);
            db.User.findOne( // get the user info
                { where: { id: blogPost.UserId } },
            ).then((userData) => {
                console.log(userData.createdAt); // object
                db.Comments.findAll( // get the comments
                    { where: { ContentId: req.params.id }, order: [["createdAt", "DESC"]] })
                    .then((allComments) => {
                        console.log(allComments);
                        res.render('fullpost.ejs', {
                            title: blogPost.dataValues.title,
                            user: req.session.user.username,
                            body: blogPost.body,
                            location: blogPost.location,
                            comments: allComments,
                            likes: blogPost.likes,
                            id: blogPost.id,
                            auth: auth,
                            author: blogPost.user_id,
                            authorId: blogPost.UserId,
                            userData: userData,
                            img: blogPost.img_path,
                            avatar: userData.picture
                        })
                    })
            })
        })
})

// get the homepage route, private route authentication required
router.get('/', checkAuth, (req, res, next) => {
    res.render('post.ejs', {
        title: 'New Post',
        user: req.session.user.username,
        // user: req.session.user || null,
    });
});



// post a new blog entry, private route, to post you must have gone through above route and therefor have access to the private page
router.post('/new', upload.single('img_path'), (req, res, next) => {
    console.log(req.file);

    Jimp.read(req.file.path)
        .then(img => {
            return img
                .scaleToFit(400, 400)
                // .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .write(`./public/img/contentsImages/${req.file.filename}`); // save
        })
        .catch(err => {
            console.error(err);
        });
    db.Contents.create({
        UserId: req.session.user.id,
        title: req.body.title,
        body: req.body.body,
        user_id: req.session.user.username,
        img_path: `/img/contentsImages/${req.file.filename}`,
        location: req.body.location,
        date: Date.now(),
    }).then((result) => {
        console.log(result);
        db.sequelize.query(`UPDATE "Contents" SET fts = to_tsvector('english', '${result.title}') || to_tsvector('english', '${result.body}') || to_tsvector('english', '${result.location}') WHERE "id" = '${result.id}'`)
            .then(() => {
                res.redirect('/homepage');
            });
    })
});

router.post('/img', upload.single('img_path'), (req, res, next) => {
    console.log(req.file.path);
    db.Contents.update({
        img_path: req.file.path,
    })
});



module.exports = router;