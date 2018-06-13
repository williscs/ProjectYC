var express = require("express");
var router = express.Router({mergeParams: true});
var question = require("../models/question");
var answer = require("../models/answer");
var middleware = require("../middleware");


// Comments new
router.get("/answer", middleware.isLoggedIn, function(req, res){
    // Find question by ID 
    question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
        } else {
            res.render("comments/answer", {question: question});      
        }
    })
})

// Comments create
router.post("/", middleware.isLoggedIn,  function(req,res){
    //lookup house using ID
    question.findById(req.params.id, function(err, question){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/question");
        } else {
            // create new answer
            answer.create(req.body.answer, function(err, answer){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    answer.author.id = req.user._id;
                    answer.author.username = req.user.username;
                    // save comment
                    answer.save();
                    // connect new answer to question
                   question.answers.push(answer._id);
                   question.save();
                    // redirect to house show page
                    req.flash("success", "Successfully created comment");
                   res.redirect('/question/' + question._id);
                }
            })
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  function(req,res){
    answer.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("answer/edit", {question_id : req.params.id, comment: foundComment});     
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    answer.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/question/" + req.params.id);
        }
    })
})



// COMMENT DESTROY ROUTE 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    answer.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/question/" + req.params.id);
       }
    });
});




module.exports = router;
