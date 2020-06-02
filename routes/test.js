var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.send('hello');
    res.render('test', {
        title: 'you are here ... Welcome!!'
    });
});



module.exports = router;
