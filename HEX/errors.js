class WrongMoveError extends Error{
    constructor(message) {
        super(message);
        this.name = "WrongMoveError";
      }
}

module.exports = WrongMoveError;