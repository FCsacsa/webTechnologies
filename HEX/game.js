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
    this.gameState = 'WAITING'
};

game.prototype.move = function(x, y, player){
    if (this.board[x][y] != 0) throw new WrongMoveError();
    this.board[x][y] = player;
};

game.prototype.gameEnded = function(x_in, y_in, player){
    let win = {
        winner: 0,
        line: []
    }
    let stack = [];
    stack.push([x_in, y_in]);
    let visited = new Set();
    let x0  = false;
    let x10 = false;
    let y0  = false;
    let y10 = false;
    let i = 0;
    while(stack.length > 0 && i < 130) {
        i++;        // SAFEGUARD AGAINST INFINITE LOOP
        let tile = stack.shift();
        let x = tile[0];
        let y = tile[1];
        visited.add(JSON.stringify(tile));
        if (x != 10 &&            !visited.has(JSON.stringify([x + 1, y + 0])) && this.board[x + 1][y + 0] == player) stack.push([x + 1, y + 0]);
        if (x != 10 && y !=  0 && !visited.has(JSON.stringify([x + 1, y - 1])) && this.board[x + 1][y - 1] == player) stack.push([x + 1, y - 1]);
        if (           y != 10 && !visited.has(JSON.stringify([x + 0, y + 1])) && this.board[x + 0][y + 1] == player) stack.push([x + 0, y + 1]);
        if (           y !=  0 && !visited.has(JSON.stringify([x + 0, y - 1])) && this.board[x + 0][y - 1] == player) stack.push([x + 0, y - 1]);
        if (x !=  0 && y != 10 && !visited.has(JSON.stringify([x - 1, y + 1])) && this.board[x - 1][y + 1] == player) stack.push([x - 1, y + 1]);
        if (x !=  0 &&            !visited.has(JSON.stringify([x - 1, y + 0])) && this.board[x - 1][y + 0] == player) stack.push([x - 1, y + 0]);
        if (x ==  0) x0  = true;
        if (x == 10) x10 = true;
        if (y ==  0) y0  = true;
        if (y == 10) y10 = true;
    }

    if(player == 1 && x0 && x10) win.winner = 1;
    if(player == 2 && y0 && y10) win.winner = 2;
    win.line = Array.from(visited);
    return win;
};

module.exports = game;