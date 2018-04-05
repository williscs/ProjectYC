var express = require("express");
var router = express.Router();
var blog = require("../models/blog");
var comment = require("../models/comment");
var middleware = require("../middleware");

// INDEX ROUTE - Show all blogs
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
    var tag = {name:req.body.tag};
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBlog = {name: name, image: image, description: description, text:text, tag:tag, author: author};
    
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


// Show route
router.get("/:id", function(req,res){
    // Find campground with provided id 
    blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            // Render show template with that campground
            res.render("blog/show", {blog: foundBlog});
        }
    });
});


// EDIT blog ROUTE 
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
    blog.findById(req.params.id, function(err, foundBlog){
            res.render("blog/edit", {blog: foundBlog, document:foundBlog.text});
    });
});

// UPDATE blog ROUTE
router.put("/:id", middleware.checkBlogOwnership, function(req,res){
    // Find and update the correct blog
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect("/blog/" + req.params.id);
        }
    });
    // Redirect to somewhere
});


// DESTROY blog ROUTE 
router.delete("/:id", middleware.checkBlogOwnership, function(req,res){
   blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blog");
       } else {
           res.redirect("/blog");
       }
   }); 
});




module.exports = router;
