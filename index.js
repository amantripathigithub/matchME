const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

mongoose.connect("mongodb+srv://aman:21632AMAN@cluster0.jrfj4bn.mongodb.net/test?retryWrites=true&w=majority").then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("not connected to database");
});

// creting schema for user

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User",userSchema);


const path = require('path');


app.use(express.json());
// setting up view engine
app.set("view engine","ejs");

// for static data
app.use(express.static("./public"));

app.use(cookieParser());


app.use(express.urlencoded({
    extended: true
}));


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



app.get('/signup', (req,res)=>{
    //res.sendFile("index");
    res.render(path.join(__dirname,"/views", "/signup"));
});


app.post('/signup', async (req,res)=>{
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
    
});




app.get('/login', (req,res)=>{
    //res.sendFile("index");
    res.render(path.join(__dirname,"/views", "/login"));
});



app.post('/login', async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    //console.log(password);
    
    //const user = {email:email,password:hashedPassword};
    //console.log (hashedPassword);

    const user_searched = await User.findOne({email:email});
   

    

    if(user_searched){
        //console.log(user_searched);
        const matched= await bcrypt.compare(password,user_searched.password);
        //console.log(user_searched.password);
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
        //res.send("not a valid details !! going to signup !! ");
        res.redirect('/signup');
        
    }
    
    //console.log(email + password)
    
});



app.get('/home', isLogin, (req,res)=>{
    
    res.render(path.join(__dirname,"/views", "/home"),{user:req.user});

    // const token = req.cookies.token;
    // //console.log(token);
    // if(token){

    //     res.render(path.join(__dirname,"/views", "/home"));
    // }else{
    //     res.redirect('/login');
    // }


    //res.render(path.join(__dirname,"/views", "/home"));
});

app.get('/logout',(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true , expires: new Date(Date.now()+1000)
    });

    res.redirect('login');

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is started at ${port}!`)
});
