var mongoose = require("mongoose");



// Schema setup
var houseSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("house", houseSchema);