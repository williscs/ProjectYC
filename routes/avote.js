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
        answer.findById(req.params.id, function (err, answer){
            if(err){
                req.flash("error", "something went wrong");
                console.log(err);
                res.redirect("/question");
            } else {
                // create a vote
                avote.create(req.body.avote, function (err, avote){
                    if(err){
                        console.log(err);
                    } else {
                    // get data from form and add to question array
                    var vote = req.body.vote
                    // add username and id to avote
                    avote.author.id = req.user._id;
                    avote.author.username = req.user.username;
                    // save comment
                    avote.save();
                    // connect new vote to answer
                    answer.votes.push(avote._id);
                    answer.save();
                    }
                })
            }
        })
      }
    });
});

module.exports = router;