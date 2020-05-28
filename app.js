const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');


var route = express.Router();

const bcrypt = require('bcrypt');
const app = express ();

const db = require('./models');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use('/users', usersRouter);
// app.set('view engine', 'ejs');



var ExifImage = require('exif').ExifImage;
 
try {
    new ExifImage({ image : './img/cathedral.jpg' }, function (error, exifData) {
        if (error)
            console.log('Error: '+error.message);
        else
            console.log(exifData); // Do something with your data!
    });
} catch (error) {
    console.log('Error: ' + error.message);
}

db.sequelize.sync();
app.listen(PORT, () => console.log(`The Godly Server is running on http://localhost${PORT}`));