var express = require('express');
var router = express.Router();
var article = require("../controllers/articleController");
var home = require("../controllers/homeController");
var photo = require("../controllers/photoController");
var people = require("../controllers/peopleController");


router.get('/', home.home);

router.get('/article/:id',article.detail);
router.get('/article/classifier',article.classifier);
router.get('/article/classifier/study',article.classifier_study);
router.get('/article/classifier/life',article.classifier_life);
router.get('/article/classifier/other',article.classifier_other);

router.get('/photos',photo.home);
router.get('/photos/:id',photo.detail);

router.get('/manage/article/all',article.manage_list);
router.get('/manage/article/study',article.manage_list_study);
router.get('/manage/article/life',article.manage_list_life);
router.get('/manage/article/other',article.manage_list_other);
router.get('/manage/article/:id',article.manage_detail);
router.post('/manage/article/:id/update',article.manage_detail_update);
router.post('/manage/article/:id/remove',article.manage_detail_remove);

router.get('/manage/photos',photo.manage_list);
router.get('/manage/photos/:id',photo.manage_detail);
router.post('/manage/photos/:id/update',photo.manage_detail_update);
router.post('/manage/photos/:id/remove',photo.manage_detail_remove);

router.get('/manage/people',people.manage);
router.get('/manage/people/update',people.update);

router.get('/manage/new/article',article.manage_new);
router.get('/manage/new/article/create',article.manage_new_create);
router.get('/manage/new/photo',photo.manage_new);
router.get('/manage/new/photo/upload',photo.manage_new_upload);

module.exports = router;
