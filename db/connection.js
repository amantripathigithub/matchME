const mongoose = require('mongoose');

//console.log(process.env.DB);
const DB = process.env.DB;
mongoose.connect(DB).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("not connected to database");
});

