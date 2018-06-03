var express = require("express");
var router = express.Router();
var question = require("../models/question");
var comment = require("../models/comment");
var middleware = require("../middleware");

// INDEX ROUTE - Show all questions
router.get("/", function(req,res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        question.find({name: regex}, function(err, allQuestions){
                if(err){
                    console.log("err");
                } else {
                    if(allQuestions.length < 1 ){
                        var noMatch = "Sorry, no questions match your query";
                    }
                    res.render("question/index", {question: allQuestions, page: 'question', noMatch: noMatch});      
                }
            });
    // adding in another query for tag searches
    } else if(req.query.tag) { 
        question.find({tag:req.query.tag}, function(err, allTags){
           if(err){
               console.log("err");
           } else {
               if(allTags.length < 1 ){
                   var noMatch = "Sorry, no questions match your query";
               }
              res.render("question/index", {question: allTags, page: 'question', noMatch: noMatch});
           }
        });
    // Get all questions from DB
    } else {
    question.find({}, function(err, allQuestions){
        if (err){
            console.log(err)
        } else {
            res.render("question/index", {question: allQuestions, page: 'question', noMatch: noMatch});      
        }
    })
    }
});


// CREATE ROUTE - Add new question to DB
router.post("/", middleware.isLoggedIn,function(req,res){
    // get data from form and add to question array
    var name = req.body.name;
    var image = req.body.image;
    var description= req.sanitize(req.body.description);
    var text = req.sanitize(req.body.text);
    var tag = req.body.tag
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newQuestion = {name: name, image: image, description: description, text:text, tag:tag, author: author};
    
    // Create a new question and save to db
    question.create(newQuestion, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            // redirect to housing page
            res.redirect("/question");
        }
    })
});


// New question route
router.get("/new", function(req, res){
    res.render("question/new");
});


// Show route
router.get("/:id", function(req,res){
    // Find campground with provided id 
    question.findById(req.params.id).populate("comments").exec(function(err, foundQuestion){
        if(err){
            console.log(err);
        } else {
            // Render show template with that campground
            res.render("question/show", {question: foundQuestion});
        }
    });
});


// EDIT question ROUTE 
router.get("/:id/edit", middleware.checkQuestionOwnership, function(req, res){
    question.findById(req.params.id, function(err, foundQuestion){
            res.render("question/edit", {question: foundQuestion});
    });
});

// UPDATE question ROUTE
router.put("/:id", middleware.checkQuestionOwnership, function(req,res){
    // Find and update the correct question
    question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion){
        if(err){
            res.redirect("/question");
        } else {
            res.redirect("/question/" + req.params.id);
        }
    });
    // Redirect to somewhere
});


// DESTROY question ROUTE 
router.delete("/:id", middleware.checkQuestionOwnership, function(req,res){
   question.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/question");
       } else {
           res.redirect("/question");
       }
   }); 
});


function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
