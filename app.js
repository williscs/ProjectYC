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



app.get("/", function(req,res){
    res.render("landing")
});


// INDEX ROUTE - Show all houses
app.get("/housing", function(req,res){
    // Get all houses from DB
    house.find({}, function(err, allHousing){
        if(err){
            console.log("err");
        } else {
            res.render("house/index", {housing: allHousing});      
        }
    })
})

// CREATE ROUTE - Add new house to DB
app.post("/housing", function(req,res){
    // get data from form and add to housing array
    var name = req.body.name;
    var image = req.body.image;
    var description= req.sanitize(req.body.description);
    var newHouse = {name: name, image: image, description: description}
    
    // Create a new house and save to db
    house.create(newHouse, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            // redirect to housing page
            res.redirect("/housing");
        }
    })
});


// NEW ROUTE - Show form to create new house
app.get("/housing/new", function(req,res){
    res.render("house/new");
});



// SHOW ROUTE - Shows more info about one house
app.get("/housing/:id", function(req,res){
    // Find campground with provided id 
    house.findById(req.params.id).populate("comments").exec(function(err, foundHouse){
        if(err){
            console.log(err);
        } else {
            // Render show template with that campground
            res.render("house/show", {house: foundHouse});
        }
    });
});


// ========================
// COMMENTS ROUTE   
// ========================

app.get("/housing/:id/comments/new", function(req, res){
    // Find house by ID 
    house.findById(req.params.id, function(err, house){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {house: house});      
        }
    })
})


app.post("/housing/:id/comments", function(req,res){
    //lookup house using ID
    house.findById(req.params.id, function(err, house){
        if(err){
            console.log(err);
            res.redirect("/housing");
        } else {
            // create new comment
            comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // connect new comment to house
                   house.comments.push(comment._id);
                   house.save();
                    // redirect to house show page
                   res.redirect('/housing/' + house._id);
                }
            })
        }
    });
});



// ==================
// AUTH ROUTES

// show register form
app.get("/register", function(req,res){
   res.render("register"); 
});

// Signup logic
app.post("/register", function(req, res){
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

app.listen(process.env.PORT,process.env.IP, function (argument) {
   console.log("Yelpcamp app started");
});

