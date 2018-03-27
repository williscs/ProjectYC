var express = require("express");
var router = express.Router();
var blog = require("../models/blog");
var comment = require("../models/comment");
var middleware = require("../middleware");

// INDEX ROUTE - Show all houses
router.get("/", function(req,res){
    // Get all blogs from DB
    blog.find({}, function(err, allBlogs){
        if (err){
            console.log(err)
        } else {
            res.render("blog/index", {blog: allBlogs, page: 'blog'});      
        }
    })
});


// CREATE ROUTE - Add new blog to DB
router.post("/", middleware.isLoggedIn,function(req,res){
    // get data from form and add to blog array
    var name = req.body.name;
    var image = req.body.image;
    var description= req.sanitize(req.body.description);
    var text = req.sanitize(req.body.text);
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlog = {name: name, image: image, description: description, text:text, author: author}
    
    // Create a new blog and save to db
    blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            // redirect to housing page
            res.redirect("/blog");
        }
    })
});


// New blog route
router.get("/new", function(req, res){
    res.render("blog/new");
});




module.exports = router;
