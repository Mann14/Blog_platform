const mongoose = require('mongoose');

const content_schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    img_url:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
});

const Content = mongoose.model('Content',content_schema);
module.exports = Content;