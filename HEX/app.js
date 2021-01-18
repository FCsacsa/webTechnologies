var express = require('express');
var path = require('path');
var logger = require('morgan');
var debug = require('debug')('hex:server');
var http = require('http');
var ws = require('ws');
var Game = require('./game.js');
var messages = require('./public/javascripts/messages.js');
var WrongMoveError = require('./errors.js');
var load = require('./routes/index');
var stats = {
  playing: 0,
  started: 0,
  finished: 0
}
var indexRouter = load(stats);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev')); //not necessary, but creates nice logs on the console
app.use(express.json()); // DO NOT DELETE, needed for the form
app.use(express.urlencoded({ extended: false })); // DO NOT DELETE, needed for the form
app.use(express.static(path.join(__dirname, 'public'))); // DO NOT DELETE, needed to load resources correctly

app.use('/', indexRouter); //set up the pages

// error handler -- made by the express generator
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// setting up the port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);
var wss = new ws.Server({server});

var last_game = null;
var connections = [];
var connectionsID = 0;

wss.on('connection', (websocket) =>{
  websocket.id = connectionsID++;
  stats.playing++;
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
    stats.started++;
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
          let curr_game = connections[websocket.id];
          curr_game.move(
            Msg.data.x,
            Msg.data.y,
            Msg.data.player
          );

          let response = messages.O_MOVE;
          response.data = Msg.data;
          let resStr = JSON.stringify(response);
          curr_game.players.first.send(resStr);
          curr_game.players.second.send(resStr);

          win = curr_game.gameEnded(Msg.data.x,Msg.data.y, Msg.data.player);
          if (win.winner != 0) {
            stats.finished++;
            let winMsg = messages.O_GAME_OVER;
            winMsg.data = win;
            winStr = JSON.stringify(winMsg);
            curr_game.players.first.send(winStr);
            curr_game.players.second.send(winStr);
          }
        }
        catch(err){
          if(err instanceof WrongMoveError){
            // inform the player that the move is invalid
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
          // the player is the first player
          curr_game.names.first = Msg.data;

          if(curr_game.players.second != null) {
            //if the second player is already connected, send him the name
            let message1 = messages.O_OPPONENT_CONNECTED;
            message1.data = Msg.data;
            curr_game.players.second.send(JSON.stringify(message1));
          }
        }
        else {
          // the message is from the seconf player
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
    stats.playing--;
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

//start listening
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



// FUNCTIONS MADE BY THE GENERATOR

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
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


