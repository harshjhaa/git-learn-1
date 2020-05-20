var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var passport = require('passport')
var flash = require('connect-flash');
var session = require('express-session')
// var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const db_URL = "mongodb+srv://jha:jha@cluster-demo-1-agxfu.mongodb.net/dashboard?retryWrites=true&w=majority"

var methodOverride = require('method-override')

var app = express();

//=================================================
//for mongodb online database
mongoose.connect(db_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected with mongodb ONLINE !!!!!!!!')
  })
  .catch(err => {
    if (err) throw err
  })
// for mongodb local database
/* mongoose.connect('mongodb://localhost:27017/dashboard_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected with mongodb offline !!!!!!!!')
  })
  .catch(err => {
    if (err) throw err
  }) */

//=================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(methodOverride('_method'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
  secret: 'secret...',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

require('./auth/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);
app.use((req, res, next) => {
  if (req.isAuthenticated())
    next();
  else
  res.redirect('/users/login')
})

app.use('/', indexRouter);

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
