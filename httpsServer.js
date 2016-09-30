'use strict';

const letsencrypt = require('./lex');
const express = require('express');

const multer = require('multer');
const bodyParser = require('body-parser');
let upload  = multer();
let app = express();

let cookieParser = require('cookie-parser');
let Session = require('express-session');

let User = require('./User');
let user = new User();

let Meal = require('./Meal');
let meal = new Meal();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://jubeatwww.nctucs.net");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", 'GET PUT POST DELETE');
    res.header("Access-Control-Allow-Header", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cookieParser());
app.use(Session({
    secret: 'ha_ha_ha_hhhhRRRRRR',
    cookie: {
        maxAge: 1000*60*60,
    }
}));


app.get('/', (req, res) => {
    res.send(req.session);
});

app.post('/provide', upload.array(),(req, res, next) => {
    let data = req.body;
    if(!req.session.isLogin){
        res.send({isLogin: false});
    } else {
        data.userId = req.session.userInfo.id;
        meal.Provide(data);
        res.send(data);
    }
});

app.post('/need', upload.array(),(req, res, next) => {
    meal.Need(req.body);
    res.send(req.body);
});

app.get('/meal', (req, res) => {
    meal.Get( (result) => {
        res.send(result);
    });
});

app.post('/register', upload.array(), (req, res, next) => {
    user.Register(req.body);
    res.send(req.body);
});

app.post('/login', upload.array(), (req, res, next) => {
    user.Login(req.body, (result, isLogin) => {
        req.session.isLogin = isLogin
        req.session.userInfo = result;
        res.send(result);
    });
});

app.get('/loginChk', (req, res) => {
    if(!req.session.userInfo){
        req.session.userInfo = {};
        req.session.isLogin = false;
    }
    let retData = req.session.userInfo;
    retData.isLogin = req.session.isLogin;
    res.send(req.session.userInfo);
});

app.post('/edit', upload.array(), (req, res, next) => {
    let email = req.session.userInfo.email;
    if(!email)
        res.send({stillLogin: false, update: false});
    else{
        user.Edit(email, req.body, (update) => {
            if(update.update){
                update.stillLogin = true;
                Object.keys(req.body).map((key) =>{
                    console.log(key);
                    req.session.userInfo[key] = req.body[key];
                });
                console.log(req.session);
                res.send(update);
            }
        });
    }
});

letsencrypt.create({
    server: 'https://acme-v01.api.letsencrypt.org/directory',
    email: 'l6104400@gmail.com',
    agreeTos: true,
    approveDomains: ['jubeatdb.nctucs.net'],
    app: app
}).listen(80, 443);
