const Article = require("../models/article");
const Article_classifier = require('../models/article_classifier');
const async = require('async');
const fs = require('fs');
const path = require('path');

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
exports.manage = function (req, res) {

    const viewModel = { classifier: [], articles: [] };

    article_new = new Article_classifier({
        classifier: "全部"
    })

    async.series([
        function (cb) {
            Article_classifier.find({}, {}, cb);
        },
        function (cb) {
            Article.find({}, {}, cb);
        },
    ], function (err, result) {
        if (err) throw err;
        viewModel.classifier = result[0];
        viewModel.classifier.unshift(article_new);
        viewModel.articles = result[1];
        res.render('manage_article', viewModel);
    })
};

/*文章管理页（具体分类）控制器*/
exports.manage_classifier = function (req, res) {

    const viewModel = { classifier: [], articles: [] };

    article_new = new Article_classifier({
        classifier: "全部"
    })
    async.series([
        function (cb) {
            Article_classifier.find({}, {}, cb);
        },
        function (cb) {
            if (req.body.classifier === "全部")
                Article.find({}, {}, cb);
            else
                Article.find({ classification: req.body.classifier }, {}, cb);
        },
    ], function (err, result) {
        if (err) throw err;
        viewModel.classifier = result[0];
        viewModel.classifier.unshift(article_new);
        viewModel.articles = result[1];
        res.render('manage_article', viewModel);
    })
};

/*文章详情管理页控制器*/
exports.manage_detail = function (req, res) {

    const viewModel = { classifier: [], article: {} };
    async.series([
        function (cb) {
            Article_classifier.find({}, {}, cb);
        },
        function (cb) {
            Article.findById(req.params.id, {}, cb);
        },
    ], function (err, result) {
        if (err) throw err;
        viewModel.classifier = result[0];
        viewModel.article = result[1];
        res.render("manage_article_detail", viewModel);
    })

};

/*处理文章详情管理页提交的修改申请post 控制器*/
exports.manage_detail_update = function (req, res) {

    async function update() {
        /*第一步，更新分类*/
        let article = await Article.findById(req.params.id);
        if (article.classification !== req.body.classification) {
            // 原有分类减一，如果数量减到0，删除该分类
            let old_classifier = await Article_classifier.findOne({ classifier: article.classification }, []);
            old_classifier.number -= 1;
            if (old_classifier.number === 0) {
                await Article_classifier.findByIdAndDelete(old_classifier._id);
            } else {
                await old_classifier.save();
            }

            // 新分类加一，如果分类不存在，新建一个分类
            let new_classifier = await Article_classifier.findOne({ classifier: req.body.classification }, []);
            if (new_classifier !== null) {
                new_classifier.number += 1;
                await new_classifier.save();
            } else {
                classifier = new Article_classifier({
                    classifier: req.body.classification,
                    number: 1,
                })
                await classifier.save();
            }
        }

        /*第二步，更新文章，需要判断有没有上传照片*/
        article.title = req.body.title;
        article.classification = req.body.classification;
        article.abstract = req.body.abstract;
        article.content = req.body.content;
        if (req.files.length === 0) {//没有上传
            await article.save();
        } else {//上传了
            var tempPath = req.files[0].path;
            var imgUrl = req.files[0].filename;
            var ext = path.extname(req.files[0].originalname).toLowerCase();
            var targetPath = path.resolve('./public/images/article/' + imgUrl + ext);
            fs.rename(tempPath, targetPath,function(err){
                if (err) throw err;
            });
            article.picture = '/images/article/' + imgUrl + ext;
            await article.save();
        }
    }
    update();
    setTimeout(() => {
        res.redirect('/manage');
    }, 100);

};

/*处理文章详情管理页提交的删除申请post 控制器*/
exports.manage_detail_delete = function (req, res) {

    async function deleteArticle() {
        //console.log("req.params.id",req.params.id)
        let article = await Article.findById(req.params.id);
        article_classifier = article.classification;
        //console.log("article_classifier",article_classifier);
        let classifier = await Article_classifier.findOne({ classifier: article_classifier });
        classifier.number -= 1;
        if (classifier.number === 0) {
            await Article_classifier.findByIdAndDelete(classifier._id);
        } else {
            await classifier.save();
        }
        await Article.findByIdAndDelete(req.params.id);
    }
    deleteArticle();
    setTimeout(() => {
        res.redirect('/manage');
    }, 100);

};



/*--------------------------发布控制器--------------------------*/
/*文章发布页控制器*/
exports.manage_new = function (req, res) {

    res.render("manage_new_article");
};

/*处理文章发布页提交的post 控制器*/
exports.manage_new_create = function (req, res) {

    async function createArticle() {
        var tempPath = req.files[0].path;
        var imgUrl = req.files[0].filename;
        var ext = path.extname(req.files[0].originalname).toLowerCase();
        var targetPath = path.resolve('./public/images/article/' + imgUrl + ext);
        fs.rename(tempPath, targetPath, function (err) {
            if (err) throw err;
        });

        article = new Article({
            title: req.body.title,
            classification: req.body.classification,
            abstract: req.body.abstract,
            content: req.body.content,
            picture: '/images/article/' + imgUrl + ext,
        })
        await article.save();

        let classifier = await Article_classifier.findOne({ classifier: req.body.classification });
        if (classifier !== null) {
            classifier.number += 1;
            await classifier.save();
        } else {
            new_classifier = new Article_classifier({
                classifier: req.body.classification,
                number: 1,
            })
            await new_classifier.save();
        }
    }
    createArticle();
    setTimeout(() => {
        res.redirect("/manage");
    }, 300);
};