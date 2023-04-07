const express = require('express');
const User=require('../models/user');
const controller = require('../controllers/login_signup');
const router = express.Router();
const jwt = require('jsonwebtoken');

//import { getSignup} from '../controllers/login_signup.js';


// middleware for checking for login is not......
const isLogin = async (req,res,next)=>{
    const token = req.cookies.token;
    
    if(token){
        const decoded= jwt.verify(token,"this is my secret key");
        req.user = await User.findOne({_id:decoded._id});
        next();
    }else{
        res.render("login");
    }
};



router.get('/signup',controller.getSignup);


router.post('/signup', controller.postSignup);


router.get('/login', controller.getLogin);


router.post('/login', controller.postLogin);

router.get('/home', isLogin,controller.getHome);

router.get('/logout',controller.getLogout);

module.exports = router;