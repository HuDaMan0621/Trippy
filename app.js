// import cookieSession from "cookie-session";
const cookieSession = require('cookie-session');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var favicon = require('serve-favicon'); //require favicon
const path = require('path');
var router = express.Router();
require('dotenv').config();
const cookie_secret = process.env.COOKIE_SECRET;



const bcrypt = require('bcrypt');
const app = express();

const db = require('./models');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homepageRouter = require('./routes/homepage');
const postRouter = require('./routes/post');
const profileRouter = require('./routes/profile');
const searchRouter = require('./routes/search');
const likeRouter = require('./routes/like');

//test route
const test = require('./routes/test');

//route to github login
const oauth = require('./routes/oauth');

const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set("img", path.join(__dirname, "img"));
app.set('views', path.join(__dirname, 'views'));

//favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(
//     session({
//         secret: 'secret',
//         resave: false,
//         saveUninitialized: false, // if set to true a cookie will be created no matter what
//         cookie: {
//             // secure: true, 
//             maxAge: 6000000000000000000000000000,
//         }
//     }));


app.use(
    cookieSession({
        secret: cookie_secret
    })
);
//test route
app.use('/test', test);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/homepage', homepageRouter);
app.use('/post', postRouter);
app.use('/profile', profileRouter);
app.use('/search', searchRouter);
app.use('/like', likeRouter);


app.use('/oauth', oauth);


app.use(express.static("public"))

// app.get('/homepage', checkAuthentication, (req, res) => {
//     res.send({ message: 'WELCOME TO THE DASHBOARD!!' });
// })
//users

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

db.sequelize.sync();
app.listen(PORT, () => console.log(`The Server is running on Http://localhost:${PORT}`));

