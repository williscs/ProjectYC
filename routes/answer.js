var express = require("express");
var router = express.Router({mergeParams: true});
var question = require("../models/question");
var answer = require("../models/answer");
var middleware = require("../middleware");


// New answer
router.get("/new", middleware.isLoggedIn, function(req, res){
    // Find question by ID 
    question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
        } else {
            res.render("answer/new", {question: question});      
        }
    })
})

// Answer create
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

// ANSWER EDIT ROUTE
router.get("/:answer_id/edit", middleware.checkAnswerOwnership,  function(req,res){
    answer.findById(req.params.answer_id, function(err, foundAnswer){
        if(err){
            res.redirect("back");
        } else {
            res.render("answer/edit", {question_id : req.params.id, answer: foundAnswer});     
        }
    });
});

// ANSWER UPDATE ROUTE
router.put("/:answer_id", middleware.checkAnswerOwnership, function(req,res){
    answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer){
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/question/" + req.params.id);
        }
    })
})



// ANSWER DESTROY ROUTE 
router.delete("/:answer_id", middleware.checkAnswerOwnership, function(req, res){
    answer.findByIdAndRemove(req.params.answer_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Answer deleted");
           res.redirect("/question/" + req.params.id);
       }
    });
});




module.exports = router;
