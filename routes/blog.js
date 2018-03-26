var express = require("express");
var router = express.Router();
var blog = require("../models/blog");
var comment = require("../models/comment");
var middleware = require("../middleware");

// INDEX ROUTE - Show all houses
router.get("/", function(req,res){
    res.render("blog/index");
});



module.exports = router;
