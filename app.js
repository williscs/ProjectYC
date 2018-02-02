var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");
var housing = require("./models/house");
var seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/house");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");





app.get("/", function(req,res){
    res.render("landing")
});


// INDEX ROUTE - Show all houses
app.get("/housing", function(req,res){
    // Get all houses from DB
    housing.find({}, function(err, allHousing){
        if(err){
            console.log("err");
        } else {
            res.render("index", {housing: allHousing});      
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
    housing.create(newHouse, function(err, newlyCreated){
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
    res.render("new.ejs");
});


// SHOW ROUTE - Shows more info about one house
app.get("/housing/:id", function(req,res){
    // Find campground with provided id 
    housing.findById(req.params.id, function(err, foundHouse){
        if(err){
            console.log(err);
        } else {
            // Render show template with that campground
            res.render("show", {house: foundHouse});
        }
    });
});

app.listen(process.env.PORT,process.env.IP, function (argument) {
   console.log("Yelpcamp app started");
});

