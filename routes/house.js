var express = require("express");
var router = express.Router();
var house = require("../models/house");
var comment = require("../models/comment");
var middleware = require("../middleware");


// INDEX ROUTE - Show all houses
router.get("/", function(req,res){
    var noMatch = null;
    // eval(require('locus'));
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            house.find({name: regex}, function(err, allHousing){
                if(err){
                    console.log("err");
                } else {
                    if(allHousing.length < 1 ){
                        var noMatch = "Sorry, no houses match your query";
                    }
                    res.render("house/index", {housing: allHousing, page: 'housing', noMatch: noMatch});      
                }
            });
    } else {
        
    // Get all houses from DB
    house.find({}, function(err, allHousing){
        if(err){
            console.log("err");
        } else {
            res.render("house/index", {housing: allHousing, page: 'housing', noMatch: noMatch});      
        }
    });
    }   
});


// CREATE ROUTE - Add new house to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form and add to housing array
    var name = req.body.name;
    var image = req.body.image;
    var description= req.sanitize(req.body.description);
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newHouse = {name: name, image: image, description: description, author: author}
    
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
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("house/new");
});



// SHOW ROUTE - Shows more info about one house
router.get("/:id", function(req,res){
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


// EDIT HOUSE ROUTE 
router.get("/:id/edit", middleware.checkHouseOwnership, function(req, res){
    house.findById(req.params.id, function(err, foundHouse){
            res.render("house/edit", {house: foundHouse});
    });
});

// UPDATE HOUSE ROUTE
router.put("/:id", middleware.checkHouseOwnership, function(req,res){
    // Find and update the correct house
    house.findByIdAndUpdate(req.params.id, req.body.house, function(err, updatedHouse){
        if(err){
            res.redirect("/house");
        } else {
            res.redirect("/housing/" + req.params.id);
        }
    });
    // Redirect to somewhere
});


// DESTROY HOUSE ROUTE 
router.delete("/:id", middleware.checkHouseOwnership, function(req,res){
   house.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/housing");
       } else {
           res.redirect("/housing");
       }
   }); 
});


function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;