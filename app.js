var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/house");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");



// Schema setup
var houseSchema = new mongoose.Schema({
    name: String,
    image: String
});

var housing = mongoose.model("house", houseSchema);

// house.create({name:"2 bed apartment in Nice", image:"https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
//         function (err, house){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("newly created house");
//             console.log(house);
//         }
//     });


//  var housing = [
//         {name:"1 bed apartment in Barca", image:"https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
//         {name:"2 bed apartment in Nice", image:"https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
//         {name:"1 bed apartment in Cannes", image:"https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
//         {name:"1 bed apartment in Barca", image:"https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
//         {name:"2 bed apartment in Nice", image:"https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"},
//         {name:"1 bed apartment in Cannes", image:"https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg?h=350&dpr=2&auto=compress&cs=tinysrgb"}
// ]


app.get("/", function(req,res){
    res.render("landing")
});

app.get("/housing", function(req,res){
    // Get all houses from DB
    housing.find({}, function(err, allHousing){
        if(err){
            console.log("err");
        } else {
            res.render("housing", {housing: allHousing});      
        }
    })
})

app.post("/housing", function(req,res){
    // get data from form and add to housing array
    var name = req.body.name;
    var image = req.body.image;
    var newHouse = {name: name, image: image}
    
    // Create a new house and save to db
    housing.create(newHouse, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            // redirect to housing page
            res.redirect("/housing");
        }
    })
});

app.get("/housing/new", function(req,res){
    res.render("new.ejs");
});

app.listen(process.env.PORT,process.env.IP, function (argument) {
   console.log("Yelpcamp app started");
});

