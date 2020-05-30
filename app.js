const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var favicon = require('serve-favicon'); //require favicon
const path = require ('path');

// import favicon from 'serve-favicon';

var router = express.Router();

const bcrypt = require('bcrypt');
const app = express();

const db = require('./models');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homepageRouter = require('./routes/homepage');
const postRouter = require('./routes/post');
const profileRouter = require('./routes/profile');
const searchRouter = require('./routes/search');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

//favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false, // if set to true a cookie will be created no matter what
        cookie: {
            // secure: true, 
            maxAge: 6000000000000000000000000000,
        }
    }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/homepage', homepageRouter);
app.use('/post', postRouter);
app.use('/profile', profileRouter);
app.use('/search', searchRouter);

// app.get('/homepage', checkAuthentication, (req, res) => {
//     res.send({ message: 'WELCOME TO THE DASHBOARD!!' });
// })
//users
// app.set('views', path.join(__dirname, 'views'));

// app.get('/index')
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('users.ejs');
});

router.post('/', (req, res) => {
    const { username, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {

        db.User.create({
            username,
            email,
            password: hash,
        }).then((result) => {
            res.redirect('/users')
        });
    });
});
//   module.exports = router;


//routes
app.get('/index', (req, res) => {
    res.send('Hello@@@@');
    // res.json(result);
    // db.Artist.findAll().then((result) => {
    //     res.json(result);
    // })
})

// db.sequelize.sync();
app.listen(PORT, () => console.log(`The Server is running on Http://localhost:${PORT}`));

