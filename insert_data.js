console.log('This script inseert some necessary data');

var async = require("async");
var Article = require("./models/article");
var Article_classifier = require('./models/article_classifier');
var People = require("./models/people");
var Photos = require("./models/photos");
var mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/blog_database2';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// var article = new Article({
//     title:"卜算子·咏梅",
//     classification:"生活感悟",
//     abstract:"零落成泥碾作尘，只有香如故",
//     content:"驿外断桥边，寂寞开无主。已是黄昏独自愁，更着风和雨",
//     picture:"/images/article/default.jpg",
// });

var article_classifier1 = new Article_classifier({
    classifier:"读书笔记",
    number:1,
})
var article_classifier2 = new Article_classifier({
    classifier:"生活感悟",
    number:1,
})

async.series([

    function(cb){
        article_classifier1.save(cb);
    },
    function(cb){
        article_classifier2.save(cb);
    }, 

],function(err,req){
    if(err) throw err;
    console.log("insert article_classifier",req[0]);
    console.log("insert article_classifier",req[1]);

    mongoose.connection.close();
});