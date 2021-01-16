var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('hex:server');
var http = require('http');
var ws = require('ws');
var Game = require('./game.js');
var messages = require('./public/javascripts/messages.js');
var WrongMoveError = require('./errors.js');

//var indexRouter = require('./routes/index'); // NOT USED
//var usersRouter = require('./routes/users'); // NOT USED
//const { connect } = require('./routes/index'); // NOT USED


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/users', usersRouter); // NOT USED
app.get('/', (req, res) => {res.render("splash.ejs", {});});
app.post('/play', (req, res) => {
  console.log(req.body.username);
  //res.sendFile('game.html', {root: "./public"});
  res.render('game.ejs', {username: req.body.username});
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
var wss = new ws.Server({server});

var last_game = null;
var connections = [];
var connectionsID = 0;

wss.on('connection', (websocket) =>{
  websocket.id = connectionsID++;
  if (last_game != null){
    //there is a non-full game
    connections[websocket.id] = last_game;
    last_game.players.second = websocket;
    websocket.send(messages.S_GET_USERNAME);
    if(last_game.names.first != null){
      let message1 = messages.O_OPPONENT_CONNECTED;
      message1.data = last_game.names.first;
      websocket.send(JSON.stringify(message1));
    }
    last_game.gameState = 'ONGOING';
    last_game = null; //the last game is now full --> there is no one waiting
  }
  else{
    //there is no full game
    var new_game = new Game(websocket);
    last_game = new_game;
    connections[websocket.id] = new_game;
    new_game.players.first = websocket;
    websocket.send(messages.S_WAITING_FOR_PLAYER);
    websocket.send(messages.S_GET_USERNAME);
  }

  websocket.on('message', (message) =>{
    Msg = JSON.parse(message);
    switch (Msg.type) {
      case messages.T_MOVE:
        try{
          connections[websocket.id].move(
            Msg.data.x,
            Msg.data.y,
            Msg.data.player
          );
          let response = messages.O_MOVE;
          response.data = Msg.data;
          let resStr = JSON.stringify(response);
          connections[websocket.id].players.first.send(resStr);
          connections[websocket.id].players.second.send(resStr);
          //TODO CHECK WIN
        }
        catch(err){
          if(err instanceof WrongMoveError){
            websocket.send(messages.S_WRONG_MOVE);
          }
          else{
            throw err;
          }
        }
        break;
    
      case messages.T_USERNAME:
        let curr_game = connections[websocket.id];
        console.log(curr_game.players.first.id);
        console.log(websocket.id);
        if(curr_game.players.first.id == websocket.id){
          curr_game.names.first = Msg.data;
          if(curr_game.players.second != null) {
            let message1 = messages.O_OPPONENT_CONNECTED;
            message1.data = Msg.data;
            curr_game.players.second.send(JSON.stringify(message1));
          }
        }
        else {
          curr_game.names.second = Msg.data;
          let message1 = messages.O_OPPONENT_CONNECTED;
          message1.data = Msg.data;
          curr_game.players.first.send(JSON.stringify(message1));
        }
      
      default:
        break;
    }
  })

  websocket.on('close', (code)=>{
    //TODO connection end handler
    let curr_game = connections[websocket.id]; //get the disconnected players game
    console.log(`connection lost || state: ${curr_game.gameState}`);
    switch (curr_game.gameState) {
      case 'WAITING':
        //ONLY ONE PLAYER JOINED
        last_game = null;
        break;

      case 'ONGOING':
        // PLAYER DISCONNECTED DURING GAME
        if (curr_game.players.first.id == websocket.id) {
          curr_game.players.second.send(messages.S_GAME_ABORTED);
        }
        else {
          curr_game.players.first.send(messages.S_GAME_ABORTED);
        }
        break;

      case 'FINISHED':
        // GAME HAS ENDED ALREADY
        // NOTHING TO DO, MAYBE CLEAN UP THE LEFTOVER VARIABLES
        break;
    
      default:
        break;
    }
  })
})

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


