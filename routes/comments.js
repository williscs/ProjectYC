var express = require("express");
var router = express.Router({mergeParams: true});
var house = require("../models/house");
var comment = require("../models/comment");
var middleware = require("../middleware");


// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn,  function(req,res){
    //lookup house using ID
    house.findById(req.params.id, function(err, house){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/housing");
        } else {
            // create new comment
            comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to house
                   house.comments.push(comment._id);
                   house.save();
                    // redirect to house show page
                    req.flash("success", "Successfully created comment");
                   res.redirect('/housing/' + house._id);
                }
            })
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req,res){
    comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {house_id : req.params.id, comment: foundComment});     
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/housing/" + req.params.id);
        }
    })
})



// COMMENT DESTROY ROUTE 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/housing/" + req.params.id);
       }
    });
});




module.exports = router;
