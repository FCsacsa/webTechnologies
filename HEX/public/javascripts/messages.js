(function(exports) {

    /*
     * Server to client: waiting for other player
     */
    exports.O_WAITING_FOR_PLAYER = {
        type: "WAITING-FOR-PLAYER"
    };
    exports.S_WAITING_FOR_PLAYER = JSON.stringify(exports.O_WAITING_FOR_PLAYER);

    /*
     * Server to client: opponent connetcted, name of opponent
     */
    exports.O_OPPONENT_CONNECTED = {
        type: "OPPONENT-CONNECTED",
        data: null
    }

    /*
     * Server to client: opponent connetcted, name of opponent
     */
    exports.O_GET_USERNAME = {
        type: "GET-USERNAME",
    }
    exports.S_GET_USERNAME = JSON.stringify(exports.O_GET_USERNAME);

    /*
     * Server to client: opponent connetcted, name of opponent
     */
    exports.O_OPPONENT_CONNECTED = {
        type: "OPPONENT-CONNECTED",
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
        type: exports.O_WRONG_MOVE
    }
    exports.S_WRONG_MOVE = JSON.stringify(exports.O_WRONG_MOVE);
    
    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED"
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