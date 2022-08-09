const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
    message: {
        text:{
            type:String,
            required:true
        },
    },
        users:Array,
        sender:{
            type:moongose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },      
    },
    {   
        timestamps:true,
    },
);

module.exports = mongoose.model('Messages', MessageSchema);

