var express = require('express');
var router = express.Router();
var createError = require('http-errors');

var data = {
  playing: 0,
  started: 0,
  finished: 0
}

/* GET home page. */
router.get('/', (req, res) => {res.render("splash.ejs", {
  playing: data.playing,
  started: data.started,
  finished: data.finished
});});

router.post('/play', (req, res) => {
  console.log(req.body.username);
  //res.sendFile('game.html', {root: "./public"});
  res.render('game.ejs', {username: req.body.username});
})

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  next(createError(404));
});

module.exports = {router, data};
