const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://aman:21632AMAN@cluster0.jrfj4bn.mongodb.net/test?retryWrites=true&w=majority").then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("not connected to database");
});
