var WrongMoveError = require('./errors.js');

var game = function(first_player){
    this.players = {
        first: first_player,
        second: null
    };
    this.names = {
        first: null,
        second: null
    }
    this.board = [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0]
    ]
    this.gameState = 'ONGOING'
};

game.prototype.move = function(x, y, player){
    if (this.board[x][y] != 0) throw new WrongMoveError();
    this.board[x][y] = player;
};

game.prototype.gameEnded = function(x, y){
    return 0;
    //TODO implement a function that checks if a player won
    //use last move as starting point?
};

module.exports = game;