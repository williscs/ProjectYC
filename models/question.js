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
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});

module.exports = mongoose.model("question", questionSchema);