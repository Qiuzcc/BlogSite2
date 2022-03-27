const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Article_classifierSchema = new Schema({
    classifier:{type:String,required:true},
    number:{type:Number,default:0},
});

module.exports = mongoose.model('Article_classifier',Article_classifierSchema);