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
   res.render("register"); 
});

// Signup logic
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.redirect("register")
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/housing");
       });
   });
});


// Show login form
router.get("/login", function(req,res){
    res.render("login");
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

// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;