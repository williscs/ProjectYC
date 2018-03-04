var house = require("../models/house");
var comment = require("../models/comment");

// ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkHouseOwnership = function(req,res,next){
        if(req.isAuthenticated()){
                house.findById(req.params.id, function(err, foundHouse){
                    if(err) {
                        res.redirect("back");
                    } else {
                            // Does user own house?
                            if(foundHouse.author.id.equals(req.user._id)){
                                next();
                            } else {
                                res.redirect("back");
                            }
                    }
                });
                
            } else {
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
                        if(foundComment.author.id.equals(req.user._id)){
                            next();
                        } else {
                            res.redirect("back");
                        }
                }
            });
            
        } else {
            res.redirect("back");
        }
};


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



module.exports = middlewareObj