const Photos = require('../models/photos');

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

};

/* 照片详情管理页管理器 */
exports.manage_detail = function(req,res){

};

/* 处理照片详情管理页提交的修改post 管理器 */
exports.manage_detail_update = function(req,res){

};

/* 处理照片详情管理页提交的remove请求 管理器 */
exports.manage_detail_remove = function(req,res){

};

/* 照片上传页管理器 */
exports.manage_new = function(req,res){

};

/* 照片上传页提交的post 管理器 */
exports.manage_new_upload = function(req,res){

};