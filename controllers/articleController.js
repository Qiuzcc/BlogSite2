const Article = require("../models/article");
const Article_classifier = require('../models/article_classifier');
const async = require('async');

/*--------------------------前台控制器--------------------------*/
/*文章分类页控制器*/
exports.classifier = function (req, res) {

    const viewModel = { empty: true, classifier: {}, articles: [] };

    Article_classifier.find({}, {}, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.render('classifier', viewModel);
        }
        else {
            viewModel.empty = false;
            viewModel.classifier = result[0];
            Article.find({ 'classification': result[0].classifier }, {}, function (err, result) {
                if (err) throw err;
                viewModel.articles = result;
                res.render('classifier', viewModel);
            })
        }
    })
};

exports.classifier_cur = function (req, res) {

    const viewModel = { empty: false, classifier: {}, articles: [] };

    async.series([

        function (cb) {
            Article_classifier.findOne({ 'classifier': req.params.name }, {}, cb);
        },
        function (cb) {
            Article.find({ 'classification': req.params.name }, {}, cb);
        },

    ], function (err, result) {
        if (err) throw err;
        viewModel.classifier = result[0];
        viewModel.articles = result[1];
        console.log(viewModel);
        res.render('classifier', viewModel);
    })

};

exports.classifier_prev = function (req, res) {

    const viewModel = { empty: false, classifier: {}, articles: [] };
    let pos;

    Article_classifier.find({}, {}, function (err, result1) {
        if (err) throw err;
        for (let i = 0; i < result1.length; i++) {
            if (result1[i].classifier == req.params.name) {
                pos = i - 1;
                break;
            }
        }
        if (pos < 0) { viewModel.classifier = result1[result1.length - 1]; }
        else { viewModel.classifier = result1[pos]; }

        Article.find({ "classification": viewModel.classifier.classifier }, {}, function (err, result2) {
            if (err) throw err;
            viewModel.articles = result2;
            res.render("classifier", viewModel);
        })
    });
};

exports.classifier_next = function (req, res) {

    const viewModel = { empty: false, classifier: {}, articles: [] };
    let pos;

    Article_classifier.find({}, {}, function (err, result1) {
        if (err) throw err;
        for (let i = 0; i < result1.length; i++) {
            if (result1[i].classifier == req.params.name) {
                pos = i + 1;
                break;
            }
        }
        if (pos < result1.length) { viewModel.classifier = result1[pos]; }
        else { viewModel.classifier = result1[0]; }

        Article.find({ "classification": viewModel.classifier.classifier }, {}, function (err, result2) {
            if (err) throw err;
            viewModel.articles = result2;
            res.render('classifier', viewModel);
        })
    })
};

/*文章详情页控制器*/
exports.detail = function (req, res) {

    // console.log('req.params.id',req.params.id);
    Article.findOne({ '_id': req.params.id }, {}, function (err, result) {
        if (err) throw err;
        res.render('article_detail', result);
    })

};


/*--------------------------后台控制器--------------------------*/
/*文章管理页（全部分类）控制器*/
exports.manage_list = function (req, res) {

};

/*文章管理页（学习笔记）控制器*/
exports.manage_list_study = function (req, res) {

};

/*文章管理页（生活感悟）控制器*/
exports.manage_list_life = function (req, res) {

};

/*文章管理页（其它）控制器*/
exports.manage_list_other = function (req, res) {

};

/*文章详情管理页控制器*/
exports.manage_detail = function (req, res) {

};

/*处理文章详情管理页提交的修改申请post 控制器*/
exports.manage_detail_update = function (req, res) {

};

/*处理文章详情管理页提交的删除申请post 控制器*/
exports.manage_detail_remove = function (req, res) {

};



/*--------------------------发布控制器--------------------------*/
/*文章发布页控制器*/
exports.manage_new = function (req, res) {

};

/*处理文章发布页提交的post 控制器*/
exports.manage_new_create = function (req, res) {

};