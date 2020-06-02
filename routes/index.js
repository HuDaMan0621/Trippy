var express = require('express');
var router = express.Router();

const images = [{ image: "../img/bg.jpg" }];


/* GET home page. */
router.get('/', function (req, res, next) {
    // res.send('hello');
    res.render('index', {
        title: 'Welcome!!',
        image: images,
        errorMessage: '',
    });
});



module.exports = router;
