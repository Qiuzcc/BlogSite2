var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mongoose = require('mongoose');               // 导入 mongoose 模块
const mongoDB = 'mongodb://127.0.0.1/blog_database';// 设置默认 mongoose 连接
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;                  // 让 mongoose 使用全局 Promise 库
const db = mongoose.connection;                     // 取得默认连接
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));  // 将连接与错误事件绑定（以获得连接错误的提示）

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
