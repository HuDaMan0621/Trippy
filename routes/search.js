const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const db = require('../models')
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;
const URL = process.env.DATABASE_URL;

const sequelize = new Sequelize('travelblog',
    'postgres',
    'postgres', {
    host: URL,
    dialect: 'postgres',
    logging: console.log,
    freezeTableName: true,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})



// search engine route!
// requires change in Contents table
// ALTER TABLE "Contents" ADD COLUMN fts tsvector;
// UPDATE "Contents" SET fts=to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''));
// CREATE INDEX textsearch_idx ON "Contents" USING GIN (fts);

router.post('/', (req, res, next) => {
    let input = req.body.search;
    if (input == '') {
        res.send('no input entered');
    }
    console.log(input);
    sequelize.query(`SELECT * FROM "Contents" WHERE (fts @@ plainto_tsquery('english', '%${input}%')) OR (user_id iLike '%${input}%')`, { type: sequelize.QueryTypes.SELECT })
        .then((results) => {
            console.log(results)
            res.render('./homepage', {
                title: 'Search Results',
                heading: `Search Results for ${input}`,
                user: '',
                posts: results
            });
        })
})


// get route when clicking on username
router.get('/id/:id', (req, res, next) => {
    let input = req.params.id;
    console.log(input);
    db.Contents.findAll({
        where: { user_id: input },
        order: [["createdAt", "DESC"]]
    }).then((results) => {
        console.log(results);
        res.render('./homepage', {
            title: 'Search Results',
            heading: `Search Results for ${input}`,
            user: '',
            posts: results
        });
    })
})

// get search input
// router.post('/', (req, res, next) => {
//     let input = req.body.search;
//     // console.log(input);
//     db.Contents.findAll({
//         where: { user_id: { [Op.iLike]: input } },
//         order: [["createdAt", "DESC"]]
//     }).then((results) => {
//         res.render('./homepage', {
//             title: 'Search Results',
//             heading: `Search Results for ${input}`,
//             user: '',
//             posts: results
//         });
//     })
// })


module.exports = router;