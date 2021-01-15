(function(exports) {

    /*
     * Server to client: waiting for other player
     */
    exports.T_WAITING_FOR_PLAYER = "WAITING-FOR-PLAYER";
    exports.O_WAITING_FOR_PLAYER = {
        type: exports.T_WAITING_FOR_PLAYER
    };
    exports.S_WAITING_FOR_PLAYER = JSON.stringify(exports.O_WAITING_FOR_PLAYER);

    /*
     * Server to client: opponent connetcted, name of opponent
     */
    exports.T_GET_USERNAME = "GET-USERNAME";
    exports.O_GET_USERNAME = {
        type: exports.T_GET_USERNAME
    }
    exports.S_GET_USERNAME = JSON.stringify(exports.O_GET_USERNAME);

    /*
     * Client to server: send username
     */
    exports.T_USERNAME = "USERNAME";
    exports.O_USERNAME = {
      type: exports.T_USERNAME,
      data: null
    }

    /*
     * Server to client: opponent connetcted, name of opponent
     */
    exports.T_OPPONENT_CONNECTED = "OPPONENT-CONNECTED";
    exports.O_OPPONENT_CONNECTED = {
        type: exports.T_OPPONENT_CONNECTED,
        data: null
    }

    /*
     * Client to server: move made
     * Server to client: verified move --> to be displayed
     */
    exports.T_MOVE = "MOVE";
    exports.O_MOVE = {
      type: exports.T_MOVE,
      data: null
    };

    exports.T_WRONG_MOVE = "WRONG-MOVE";
    exports.O_WRONG_MOVE = {
        type: exports.T_WRONG_MOVE
    }
    exports.S_WRONG_MOVE = JSON.stringify(exports.O_WRONG_MOVE);
    
    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.T_GAME_ABORTED = "GAME-ABORTED"
    exports.O_GAME_ABORTED = {
      type: exports.T_GAME_ABORTED
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);
  
   
    /*
     * Server to Player A & B: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
      type: exports.T_GAME_OVER,
      data: null
    };
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);