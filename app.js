var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var coolRouter = require('./routes/cool');
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site
const compression = require("compression");
const helmet = require("helmet");
require('dotenv').config();


// Create the Express application object
const app = express();

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(compression()); // Compress all routes

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

// …


// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dev_db_url = "mongodb://localhost:27017/local_library";

const mongoDB = process.env.MONGODB_URI || dev_db_url;


main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); // http://localhost:3000/
app.use('/users', usersRouter); // http://localhost:3000/users
app.use('/cool', coolRouter); // http://localhost:3000/cool

app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.


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
