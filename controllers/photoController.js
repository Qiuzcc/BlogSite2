const Photos = require('../models/photos');
const fs = require('fs');
const path = require('path');

/*----------------------------前台管理器----------------------------*/
/* 照片展示页管理器 */
exports.home = function(req,res){
    
    const viewModel = {photos:[]};

    Photos.find({},{},function(err,result){
        if(err) throw err;
        viewModel.photos = result;
        res.render('photos',viewModel);
    })
    
};

/* 照片详情页管理器 */
exports.detail = function(req,res){

    const viewModel = {photo:{}};
    Photos.findOne({'_id':req.params.id},{},function(err,result){
        if(err) throw err;
        viewModel.photo = result;
        console.log(viewModel);
        res.render('photo_detail',viewModel);
    })
};


/*----------------------------后台管理器----------------------------*/
/* 照片管理页管理器 */
exports.manage_list = function(req,res){

    Photos.find({},{},function(err,result){
        res.render("manage_photo",{photos:result});
    })
    
};

/* 加载照片编辑页 管理器 */
exports.manage_detail = function(req,res){

    Photos.findById(req.params.id,function(err,photo){
        res.render("manage_photo_detail",photo);
    })
    
};

/* 处理照片详情管理页提交的修改post 管理器 */
exports.manage_detail_update = function(req,res){

    Photos.findByIdAndUpdate(req.params.id,
        {title:req.body.title,description:req.body.description},
        function(err,result){
            if(err) throw err;
            res.redirect("/manage/photos");
        })
};

/* 处理照片详情管理页提交的remove请求 管理器 */
exports.manage_detail_delete = function(req,res){
    
    Photos.findByIdAndDelete(req.params.id,
        function(err){
            if(err) throw err;
            res.redirect("/manage/photos");
        })

};

/* 照片上传页管理器 */
exports.manage_new = function(req,res){

    res.render("manage_new_photo");
};

/* 照片上传页提交的post 管理器 */
exports.manage_new_upload = function(req,res){

    var tempPath = req.files[0].path;
    var imgUrl = req.files[0].filename;
    var ext = path.extname(req.files[0].originalname).toLowerCase();
    var targetPath = path.resolve('./public/images/photos/'+imgUrl+ext);
    fs.rename(tempPath,targetPath,function(err){
        if (err) throw err;
        photo = new Photos({
            title:req.body.title,
            description:req.body.description,
            file:'/images/photos/'+imgUrl+ext,
        })
        photo.save(function(err){
            if (err) throw err;
            res.redirect('/manage/photos');
        })
    })
};