var mongoose = require("mongoose");

// Schema setup
var questionSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    text:String,
    tag: [],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
        ]
});

module.exports = mongoose.model("question", questionSchema);