const People = require('../models/people');
const Article = require("../models/article");
const Article_classifier = require("../models/article_classifier");
const async = require('async');

/* 首页 */
exports.home = function(req,res){

    const viewModel = {articles:[],people:{},classifier:[]};

    async.parallel([

        function(cb){
            People.findOne({},{},cb);
        },
        function(cb){
            Article.find({},{},{sort:{timestamp:-1}},cb)
        },
        function(cb){
            Article_classifier.find({},{},cb)
        }

    ],function(err,result){
        if(err) throw err;
        // console.log("result[0]",result[0]);
        // console.log("result[1]",result[1]);
        // console.log("result[2]",result[2]);
        viewModel.people = result[0];
        viewModel.articles = result[1];
        viewModel.classifier = result[2];
        res.render('home',viewModel);
    });
};