const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path:'db/config.env'});
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const User=require('./models/user');
const con =require('./db/connection');
const path = require('path');
const login_signup_router=require('./routes/login_signup.js');

app.use(express.json());
// setting up view engine
app.set("view engine","ejs");

// for static data
app.use(express.static("./public"));
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}));
app.use(login_signup_router);



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is started at ${port}!`)
});





