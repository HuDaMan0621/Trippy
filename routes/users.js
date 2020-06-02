var express = require('express');
var router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users.ejs', {
    title: 'Login Page',
  });
});

//register
router.post('/', (req, res) => {
  const { username, email, password } = req.body;
  db.User.findOne( // get the user info
    {
      where: {
        [Op.or]: [
          { username: req.body.username },
          { email: req.body.email }
        ]
      }
    }).then((result) => {
      console.log(result);
      if (result == null) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          db.User.create({
            username,
            email,
            password: hash,
          }).then((result) => {
            res.redirect('/')
          });
        });
      } else {
        res.send('username taken')
      }
    })
})



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

//so when the logout is called, this part of the code is listening for the command. then it will log the user out and redirects to the homepage or where / is
router.get('/logout', (req, res) => {
  req.session = null ;
  res.redirect('/');
})
module.exports = router;
