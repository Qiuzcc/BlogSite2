const Article_classifier = require('../models/article_classifier');
const People = require('../models/people');
const async = require('async');
const fs = require('fs');
const path = require('path');
const people = require('../models/people');

/* 个人信息管理页管理器 */
exports.manage = function (req, res) {

    const viewModel = { classifier: [], people: {} };

    article_new = new Article_classifier({
        classifier: "全部"
    })

    async.series([
        function (cb) {
            Article_classifier.find({}, {}, cb);
        },
        function (cb) {
            People.findOne({}, {}, cb);
        },
    ], function (err, result) {
        if (err) throw err;
        result[0].unshift(article_new);
        viewModel.classifier = result[0];
        viewModel.people = result[1];
        viewModel.people.github = viewModel.people.github.substr(8);  //去除前缀https://
        viewModel.people.weibo = viewModel.people.weibo.substr(8);
        res.render("manage_people", viewModel);
    })

};

/* 处理信息修改申请的管理器 */
exports.update = function (req, res) {
    if(req.files.length===0){
        People.findOne({},{},function(err,people){
            people.name = req.body.name;
            people.description = req.body.description;
            people.github = "https://"+req.body.github;
            people.weibo = "https://"+req.body.weibo;
            people.save(function(err,result){
                if(err)throw err;
                res.redirect("/manage/people");
            });
        })
    }
    else if(req.files.length===1){
        var tempPath = req.files[0].path;//照片upload保存的路径
        var imgUrl = req.files[0].filename; //照片的名称（没有后缀）
        var ext = path.extname(req.files[0].originalname).toLowerCase(); //获取照片原始的后缀
        var targetPath = path.resolve('./public/images/people/' + imgUrl + ext);    //path获取到的是项目根目录
        fs.rename(tempPath, targetPath, function(err){
            if (err) throw err;
            People.findOne({},{},function(err,people){
                people.name = req.body.name;
                people.description = req.body.description;
                people.github = "https://"+req.body.github;
                people.weibo = "https://"+req.body.weibo;
                if(req.files[0].fieldname == "portrait"){
                    people.photo = '/images/people/' + imgUrl + ext;
                }
                else{
                    people.wechat = '/images/people/' + imgUrl + ext;
                }
                people.save(function(err,result){
                    if(err)throw err;
                    res.redirect("/manage/people");
                });
            })
        })
    }
    else{
        People.findOne({},{},function(err,people){
            people.name = req.body.name;
            people.description = req.body.description;
            people.github = "https://"+req.body.github;
            people.weibo = "https://"+req.body.weibo;

            async.series([
                function(cb){
                    var tempPath = req.files[0].path;//照片upload保存的路径
                    var imgUrl = req.files[0].filename; //照片的名称（没有后缀）
                    var ext = path.extname(req.files[0].originalname).toLowerCase(); //获取照片原始的后缀
                    var targetPath = path.resolve('./public/images/people/' + imgUrl + ext);    //path获取到的是项目根目录
                    people.photo = '/images/people/' + imgUrl + ext;
                    fs.rename(tempPath, targetPath, cb);
                },
                function(cb){
                    var tempPath = req.files[1].path;//照片upload保存的路径
                    var imgUrl = req.files[1].filename; //照片的名称（没有后缀）
                    var ext = path.extname(req.files[1].originalname).toLowerCase(); //获取照片原始的后缀
                    var targetPath = path.resolve('./public/images/people/' + imgUrl + ext);    //path获取到的是项目根目录
                    people.wechat = '/images/people/' + imgUrl + ext;
                    fs.rename(tempPath, targetPath, cb);
                },
            ],function(err,result){
                if(err) throw err;
                people.save(function(err){
                    if(err) throw err;
                    res.redirect("/manage/people");
                })
            })
        })
    }
};