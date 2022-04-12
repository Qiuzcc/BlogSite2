var express = require('express');
var router = express.Router();
var multer = require('multer');
var article = require("../controllers/articleController");
var home = require("../controllers/homeController");
var photo = require("../controllers/photoController");
var people = require("../controllers/peopleController");

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        // 头像和微信头像，保存到/images/people
        if(file.fieldname == "portrait" || file.fieldname == "wechat"){
            cb(null,'./public/images/people');
        }
        // 上传照片，保存到/images/photos
        else if(file.fieldname == "photo"){
            cb(null,'./public/images/photos');
        }
        else if(file.fieldname == "picture"){
            cb(null,'./public/images/article');
        }
        else{
            console.log(file.fieldname);
            cb({ error: 'fieldname not supported' });
        }
    }
})
var upload = multer({storage:storage});

router.get('/', home.home);

router.get('/article',article.classifier);
router.get('/article/cur/:name',article.classifier_cur);
router.get('/article/prev/:name',article.classifier_prev);
router.get('/article/next/:name',article.classifier_next);
router.get('/article/:id',article.detail);
 
router.get('/photos',photo.home);
router.get('/photos/:id',photo.detail);

router.get('/manage',article.manage);
router.post('/manage/article',article.manage_classifier);
router.get('/manage/article/detail/:id',article.manage_detail);
router.post('/manage/article/detail/:id/update',upload.any(),article.manage_detail_update);
router.get('/manage/article/detail/:id/delete',article.manage_detail_delete);

router.get('/manage/photos',photo.manage_list);
router.get('/manage/photos/:id',photo.manage_detail);
router.post('/manage/photos/:id/update',upload.any(),photo.manage_detail_update);
router.get('/manage/photos/:id/delete',photo.manage_detail_delete);

router.get('/manage/people',people.manage);
router.post('/manage/people',upload.any(),people.update); //接受一切上传的文件。文件数组将保存在 req.files

router.get('/manage/new/article',article.manage_new);
router.post('/manage/new/article',upload.any(),article.manage_new_create);
router.get('/manage/new/photo',photo.manage_new);
router.post('/manage/new/photo',upload.any(),photo.manage_new_upload);

module.exports = router;
