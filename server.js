// base s
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");

const app =express();
app.set('view engine',"ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
const path = require("path");
const multer =require("multer");

const storage =multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'public/scanners')
  },
  filename: (req,file,cb)=>{
    console.log(file);
    cb(null,Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage:storage,limits:{fileSize:1000000},allowedFiles:function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(pdf|jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = 'Only pdf|jpg|JPG|jpeg|JPEG|png|PNG file type are allowed!';
        return cb(new Error('Only pdf|jpg|JPG|jpeg|JPEG|png|PNG file type  are allowed!'), false);
    }
    cb(null, true);
}}); 
// base e



// mongoose s

// getting-started.js
const mongoose = require('mongoose');
const { fileLoader } = require("ejs");
const { allowedNodeEnvironmentFlags } = require("process");




mongoose.connect("mongodb+srv://Himanshu:prrank1217@cluster0.epascfm.mongodb.net/?retryWrites=true&w=majority").then(()=>{
  const dataSchema = new mongoose.Schema({
    name: String,
    phn_no: Number,
    mail : String,
    caption : String,
    message : String,
    img : String,
    ress : String
  });
  
  const Data = mongoose.model('Data', dataSchema);
  
  // mongoose e
  
  
  
  app.get("/",function(req,res){
      res.render("home");
  });
  
  // raise s
  app.post("/raise",function(req,res){
      res.render("raise");
  })
  
  app.post("/upl",upload.single('scanner'),function(req,res){
     
      const a = req.file.filename;
      const dataa = new Data ({
        name: req.body.name,
        phn_no: req.body.phn_no,
        mail: req.body.mail,
        caption: req.body.caption,
        message: req.body.msg,
        img: a,
        ress: req.body.ress
      });
      dataa.save();
      
      if(req.body.ress=='y'||req.body.ress=='Y'){
        res.render("after",{txt:"Our Team Will Contact You Soon For Your Website, Rs XXX Would Be Applied For Your Website",txt1:"You Can Also Access Through Donate Portal On This Website.. Thank_You"});
      }else{
  
      }
      res.render("after",{txt:"Our Team Will Contact You Soon For Confirmation And Details",txt1:"You Can Access Through Donate Portal On This Website.. Thank_You"});
  })
  
  // raise e
  
  
  // donate s
  
  app.post("/donate",function(req,res){
    res.render("donate");
  })
  app.post("/search",function(req,res){
    const a = req.body.check;
    
    Data.findOne({mail:a})
    .then((docs)=>{
      const aa ="/scanners/"+docs.img;
      // console.log(aa);
      //  res.render("final",{name:docs.name,mail:docs.mail,caption:docs.caption,msg:docs.message,img:aa});
      res.render("page",{cap:docs.caption,msg:docs.message,img:aa,name:docs.name});
    })
    .catch((err)=>{
       console.log(err);
       res.render("donate");
    });
  })
  
  // donate e
  
  app.listen(process.env.PORT||3000,function(){
      console.log("Server Started on PORT");
  });
})