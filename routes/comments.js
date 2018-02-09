var express = require("express");
var router = express.Router({mergeParams: true});
var house = require("../models/house");
var comment = require("../models/comment");


// Comments new
router.get("/new", isLoggedIn, function(req, res){
    // Find house by ID 
    house.findById(req.params.id, function(err, house){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {house: house});      
        }
    })
})

// Comments create
router.post("/", isLoggedIn,  function(req,res){
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


// Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
