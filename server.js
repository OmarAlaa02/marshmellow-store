const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const MONGODB = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.mongourl;
const csrfProtection = csrf();

const Store = new MONGODB({
    uri: url,
    collection: 'sessions'
});

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.set('view engine', 'ejs');
app.set('views', './views');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    store: Store
}));


app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    
    next();
});

app.use('/admin', adminRouter);
app.use(userRouter);


app.use('/', (req, res) => {
    res.status(404).send('<h1>Not found</h1>');
});


mongoose.connect(url).then(() => {
    app.listen(3000, () => console.log('Listening on port 3000'));
}).catch(err => console.log(err));
