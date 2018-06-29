var express = require("express");
var router = express.Router({mergeParams: true});
var question = require("../models/question");
var answer = require("../models/answer");
var avote = require("../models/avote");
var middleware = require("../middleware");


// Vote create
router.post("/", function(req,res){
    // Look up the question in the database 
    question.findById(req.params.id, function (err, question){
       if(err){
           req.flash("error", "something went wrong");
           console.log(err);
           res.redirect("/question");
       } else {
        //   Lookup answer in the database
        answer.findById(req.params.id, function (err, question){
            
        })
       }
    });
    
    //lookup answer in the database
    answer.findById(req.params.id, function(err, question){
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

module.exports = router;