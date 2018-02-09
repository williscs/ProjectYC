var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var house = require("./models/house");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var comment = require("./models/comment");
var seedDB = require("./seeds");

var commentRoutes = require("./routes/comments");
var houseRoutes = require("./routes/house");
var indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/house");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


// PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "workrest is awesome",
    resave:false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser= req.user;
   next();
});

app.use("/", indexRoutes);
app.use("/housing", houseRoutes);
app.use("/housing/:id/comments", commentRoutes);



app.listen(process.env.PORT,process.env.IP, function (argument) {
   console.log("Yelpcamp app started");
});

