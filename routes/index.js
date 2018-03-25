var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req,res){
    res.render("landing")
});

// show register form
router.get("/register", function(req,res){
   res.render("register", {page:'register'}); 
});

// Signup logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   if(req.body.adminCode === "secretcode123"){
       newUser.isAdmin = true;
   }
   User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to ProjectYC " + user.username);
           res.redirect("/housing");
       });
   });
});


// Show login form
router.get("/login", function(req,res){
    res.render("login", {page:'login'});
});

// Login route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/housing",
        failureRedirect:"/login"
    }), function(req,res){
    
});

// Logout route 
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/housing");
});





module.exports = router;