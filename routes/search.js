var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const db = require('../models')
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;

// get route when clicking on username
router.get('/id/:id', (req, res, next) => {
    let input = req.params.id;
    console.log(input);
    db.Contents.findAll({
        where: { user_id: input },
        order: [["createdAt", "DESC"]]
    }).then((results) => {
        res.render('./homepage', {
            title: 'Search Results',
            heading: `Search Results for ${input}`,
            user: '',
            posts: results
        });
    })
})

// get search input
router.post('/', (req, res, next) => {
    let input = req.body.search;
    console.log(input);
    db.Contents.findAll({
        where: { user_id: { [Op.iLike]: input } },
        order: [["createdAt", "DESC"]]
    }).then((results) => {
        res.render('./homepage', {
            title: 'Search Results',
            heading: `Search Results for ${input}`,
            user: '',
            posts: results
        });
    })
})


module.exports = router;