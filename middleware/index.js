var house = require("../models/house");
var comment = require("../models/comment");
var blog = require("../models/blog")

// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkHouseOwnership = function(req,res,next){
        if(req.isAuthenticated()){
                house.findById(req.params.id, function(err, foundHouse){
                    if(err) {
                        req.flash("error", "House not found");
                        res.redirect("back");
                    } else {
                            // Does user own house?
                            if(foundHouse.author.id.equals(req.user._id) || req.user.isAdmin){
                                next();
                            } else {
                                req.flash("error", "You don't have permission to do that");
                                res.redirect("back");
                            }
                    }
                });
                
            } else {
                req.flash("error", "You need to be logged in to do that");
                res.redirect("back");
            }
};

middlewareObj.checkBlogOwnership = function(req,res,next){
        if(req.isAuthenticated()){
                blog.findById(req.params.id, function(err, foundBlog){
                    if(err) {
                        req.flash("error", "Blog not found");
                        res.redirect("back");
                    } else {
                            // Does user own blog?
                            if(foundBlog.author.id.equals(req.user._id) || req.user.isAdmin){
                                next();
                            } else {
                                req.flash("error", "You don't have permission to do that");
                                res.redirect("back");
                            }
                    }
                });
                
            } else {
                req.flash("error", "You need to be logged in to do that");
                res.redirect("back");
            }
};


middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
            comment.findById(req.params.comment_id, function(err, foundComment){
                if(err) {
                    res.redirect("back");
                } else {
                        // Does user own comment?
                        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                            next();
                        } else {
                            req.flash("error", "You don't have permission to do that");
                            res.redirect("back");
                        }
                }
            });
            
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
};


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in first");
    res.redirect("/login");
}



module.exports = middlewareObj