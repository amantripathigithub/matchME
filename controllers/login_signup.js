const express = require('express');
const User=require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
router.use(express.json());
// setting up view engine

// for static data
router.use(express.static("../public"));






const path = require('path');

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

 const getSignup = (req,res)=>{
    res.render(path.join(__dirname,"../views", "/signup"));
}

// app.get('/signup', (req,res)=>{
//     res.render(path.join(__dirname,"/views", "/signup"));
// });

const postSignup = async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const hashedPassword= await bcrypt.hash(password,10);
    const user = {email:email,password:hashedPassword};

    const saved = await User.findOne({email:email});
    if(saved){
        res.send("email exists already go to login!!");
    }else{
        await User.create(user);
        res.redirect("/login");
    }
} 

// app.post('/signup', async (req,res)=>{
//     const email=req.body.email;
//     const password=req.body.password;
//     const hashedPassword= await bcrypt.hash(password,10);
//     const user = {email:email,password:hashedPassword};

//     const saved = await User.findOne({email:email});
//     if(saved){
//         res.send("email exists already go to login!!");
//     }else{
//         await User.create(user);
//         res.redirect("/login");
//     }
    
// });


// app.get('/login', (req,res)=>{
//     res.render(path.join(__dirname,"/views", "/login"));
// });

const getLogin=(req,res)=>{
    res.render(path.join(__dirname,"../views", "/login"));
}

// app.post('/login', async (req,res)=>{
//     const email=req.body.email;
//     const password=req.body.password;
//     const user_searched = await User.findOne({email:email});
   
//     if(user_searched){
//         const matched= await bcrypt.compare(password,user_searched.password);
//         if(matched){
//             const token = jwt.sign({_id:user_searched._id},"this is my secret key");
//             res.cookie("token",null,{
//                 httpOnly:true , expires: new Date(Date.now())
//             });
//             res.cookie("token",token,{
//                 httpOnly:true , expires: new Date(Date.now() + 100*1000)
//             });
//             res.redirect("/home");
//         }else{
//             return res.render('login',{message:"incorrect password"});
//         }
        
//     }else{
        
//         res.redirect('/signup');
        
//     }
   
// });

const postLogin = async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const user_searched = await User.findOne({email:email});
   
    if(user_searched){
        const matched= await bcrypt.compare(password,user_searched.password);
        if(matched){
            const token = jwt.sign({_id:user_searched._id},"this is my secret key");
            res.cookie("token",null,{
                httpOnly:true , expires: new Date(Date.now())
            });
            res.cookie("token",token,{
                httpOnly:true , expires: new Date(Date.now() + 100*1000)
            });
            res.redirect("/home");
        }else{
            return res.render('login',{message:"incorrect password"});
        }
        
    }else{
        
        res.redirect('/signup');
        
    }
}

// app.get('/home', isLogin, (req,res)=>{
    
//     res.render(path.join(__dirname,"/views", "/home"),{user:req.user});

// });

const getHome = (req,res)=>{
    res.render(path.join(__dirname,"../views", "/home"),{user:req.user});
}

// app.get('/logout',(req,res)=>{
//     res.cookie("token",null,{
//         httpOnly:true , expires: new Date(Date.now()+1000)
//     });

//     res.redirect('login');

// });

const getLogout=(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true , expires: new Date(Date.now()+1000)
    });

    res.redirect('login');
}

module.exports = {getSignup,postSignup,getLogin,postLogin,getHome,getLogout};
