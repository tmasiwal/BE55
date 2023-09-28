const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({

    username:String,
   content:String,
   blogId:String,
   userID:String,
   image:String,
    
},{
    versionKey:false
})

const CommentModel =mongoose.model("comment",commentSchema);

module.exports = {CommentModel}


/*
{username : "Jane", content : "Good One"} 
*/