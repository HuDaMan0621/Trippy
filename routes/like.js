var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');
const db = require('../models')
const bcrypt = require('bcrypt');

// add like to Content.like 
router.get('/:id', function (req, res, next) {
    let id = Number(req.params.id);

    db.Contents.findByPk(id)
        .then((result) => {
            console.log('add like')
            result.increment('likes');
            res.redirect(`../post/id/${id}`);
        })

});

module.exports = router;