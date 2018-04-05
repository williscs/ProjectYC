var mongoose = require("mongoose");

// Schema setup
var blogSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    text:String,
    tag:{name:String},
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

module.exports = mongoose.model("blog", blogSchema);