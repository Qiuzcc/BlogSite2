console.log('This script inital some necessary data');

var async = require("async");
var Article = require("./models/article");
var People = require("./models/people");
var Photos = require("./models/photos");
var mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/blog_database2';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var article = new Article({
    title:"蝶恋花·庭院深深深几许",
    classification:"读书笔记",
    abstract:"泪眼问花花不语，乱红飞过秋千去",
    content:"庭院深深深几许，杨柳堆烟，帘幕无重数。玉勒雕鞍游冶处，楼高不见章台路。雨横风狂三月暮，门掩黄昏，无计留春住。泪眼问花花不语，乱红飞过秋千去。",
    picture:"/images/article/default.jpg",
});

var people = new People({
    name:"timegogo",
    description:"神即道，道法自然，如来",
    photo:"/images/people/default.jpg",
    github:"https://www.github.com",
    wechat:"/images/people/default.jpg",
    weibo:"https://www.weibo.com",
});

var photo = new Photos({
    title:"照片",
    description:"无意苦争春，一任群芳妒。零落成泥碾作尘，只有香如故。",
    file:"/images/photos/default.jpg",
});

async.parallel([

    function(cb){
        article.save(cb);
    },
    function(cb){
        people.save(cb);
    },
    function(cb){
        photo.save(cb);
    }

],function(err,req){
    if(err) throw err;
    console.log("init article",req[0]);
    console.log("init person",req[1]);
    console.log("init photo",req[2]);

    mongoose.connection.close();
});