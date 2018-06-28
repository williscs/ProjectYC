var mongoose = require("mongoose");

var avoteSchema = mongoose.Schema({
    vote: Number,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
}); 

module.exports = mongoose.model("avote", avoteSchema);