
// import fetch from 'node-fetch';
const fetch = require('node-fetch');
const db = require('../models');


var express = require('express');


var router = express.Router();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
console.log({ client_id, client_secret });
// import cookieSession from "cookie-session";
// var GitHubStrategy = require('passport-github').Strategy;
// const app = express()

//try to get the hello to work
router.get('/login/github', (req, res) => {
    // res.send('hello')
    const url = `http://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=https://trippy-blog.herokuapp.com/oauth/login/github/callback`
    res.redirect(url)
})
// try to get the hello to work
// router.get('/login/github', (req, res) => {
//     // res.send('hello')
//     // const url = `http://github.com/login/oauth/authorize?client_id=Iv1.943166cb5a459840&redirect_uri=http://localhost:9000/login/github/callback`
//     res.render(`http://github.com/login/oauth/authorize?client_id=Iv1.943166cb5a459840&redirect_uri=http://localhost:9000/oauth/login/github/callback`);
// })
// router.get('/', function (req, res, next) {
//     // res.send('hello');
//     res.render('../views/test', {
//         title: 'you are here ... Welcome!!'
//     });
// });

async function getAccessToken(code) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id,
            client_secret,
            code
        })
    })
    const data = await res.text()
    console.log(res, code);
    const params = new URLSearchParams(data)
    return params.get('access_token')
}

async function getGithubUser(access_token) {
    const req = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `bearer ${access_token}`
        }
    })
    const data = await req.json()
    console.log(data);
    return data
}

router.get('/login/github/callback', async (req, res) => {
    const code = req.query.code
    const token = await getAccessToken(code)
    const githubData = await getGithubUser(token);
    // res.json(githubData);
    if (githubData) {
        db.User.findOrCreate({
            where: {
                username: `github:${githubData.id}`
            },
            defaults: {
                username: `github:${githubData.id}`,
                email: githubData.email
            }
        }).then(User => {
            console.log(githubData.login);
            //this part checks to see if the user is a github user, 
            //if they are, we will use their session information and apply to the profile page.
            req.session.githubId = githubData.id
            console.log(User)
            req.session.token = token
            req.session.user = User[0]
            req.session.user.githubData = githubData
            req.session.user.username = githubData.login

            console.log('test starting here !!!!!!!!!!!!!!!!!!!!!!!')
            console.log(req.session.user.username)
            console.log('test starting we need this to print !!!!!!!!!!!!!!!!!!!!!!!')
            console.log(req.session.user.id)

            // console.log(req.session.user)
            // console.log(User.id)

            res.redirect('/homepage')
        })
    } else {
        console.log("Error")
        res.send('Error happened')
    }
})
router.get('/test', async (req, res) => {
    const code = req.query.code
    const token = await getAccessToken(code)
    const githubData = await getGithubUser(token);
    // res.json(githubData);
    if (githubData) {
        req.session.githubId = githubData.id
        req.session.token = token
        res.send("it worked!");
        // res.redirect('/admin')
    } else {
        console.log("Error")
        res.send('Error happened')
    }
});
router.get("/admin", (req, res) => {
    if (req.session.githubId === 57694281) {
        res.send("Hello ${username} welcome to the homepage!!!!  " + JSON.stringify(req.session));
    } else {
        res.send('Not authorized, <a href="/login/github">login</a>');
    }
});

router.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/') //redirect to the home page
})


module.exports = router;