var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app1 = express();

// view engine setup
app1.set('views', path.join(__dirname, 'views'));
app1.set('view engine', 'ejs');

app1.use(logger('dev'));
app1.use(express.json());
app1.use(express.urlencoded({ extended: false }));
app1.use(cookieParser());
app1.use(express.static(path.join(__dirname, 'public')));

app1.use('/', indexRouter);
app1.use('/users', usersRouter);

// catch 404 and forward to error handler
app1.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app1.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app1;
