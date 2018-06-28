var mongoose = require("mongoose");

var answerSchema = mongoose.Schema({
    text: String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    votes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "avote"
        }
        ]
}); 

module.exports = mongoose.model("Answer", answerSchema);