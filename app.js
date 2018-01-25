var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("landing")
});

app.get("/housing", function(req,res){
    var housing = [
        {name:"1 bed apartment in Barca", image:"https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
        {name:"2 bed apartment in Nice", image:"https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
        {name:"1 bed apartment in Cannes", image:"https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"}
    ]
    
    res.render("housing", {housing:housing});
})

app.listen(process.env.PORT,process.env.IP, function (argument) {
   console.log("Yelpcamp app started");
});

