require('dotenv').config()
console.log(process.env)
const express = require ("express");
const bodyparser = require("body-parser");
const ejs = require ("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema ({
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]})

const User = new mongoose.model("User", userSchema);


app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(function(foundUser){
        if(foundUser){
            if(foundUser.password === password )
        res.render("secrets")}
        })
    }

)

app.get("/register",function(req,res){
    res.render("register")})
    
app.post("/register",function(req,res){  
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then(function(results){
        if(results){
            console.log("Registered Successfully");
            res.render("secrets")
        }
    })})


app.listen(3000, function(req,res) {
    console.log("Server started on port 3000");
  });
  