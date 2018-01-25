var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("landing")
});

// app.get("/housing", function(req,res){
//     var housing = [
//         {name:"1 bed apartment in Barca", image:"https://www.pexels.com/photo/stairs-home-loft-lifestyle-2459/"}
//         {name:"2 bed apartment in Nice", image:""}
//         {name:"1 bed apartment in Cannes", image:""}
//     ]
// })

app.listen(process.env.PORT,process.env.IP, function (argument) {
   console.log("Yelpcamp app started");
});

// app.listen(3000,function(){
// console.log("Yelpcamp server is running! ");
// });


// // app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
//   var addr = server.address();
//   console.log("Chat server listening at", addr.address + ":" + addr.port);
// });