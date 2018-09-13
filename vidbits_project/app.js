const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = require('express').Router();
const videosRoute = require('./routes/videos');

// View engine setup
app.engine('handlebars', expressHandlebars({defaultLayout: 'app'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', videosRoute);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Uncomment to print route info
 * 
//console.log(app._router.stack);

//console.log("routes ...")
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    //console.log(r.route.path)
  }
})
*/
module.exports = app;