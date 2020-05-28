var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users.ejs', {
    title: 'Login Page',
  });
});

//register
router.post('/', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(req.body.password, 10, (err, hash) => {

    db.User.create({
      username,
      email,
      password: hash,
    }).then((result) => {
      res.redirect('/users')
    });
  });
});


//sign in
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.User.findOne({ where: { username } })
    .then(User => {
      bcrypt.compare(password, User.password, (err, match) => {
        if (match) {
          req.session.user = User;
          res.redirect('/homepage');
        } else {
          res.send('Incorrect Password');
        }
      });
    })
    .catch(() => {
      res.send('username not found');
    })
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/index');
})
module.exports = router;
