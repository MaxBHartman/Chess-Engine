class Piece {
  constructor(file, rank, moveCount, type) {
    this.file = file;
    this.rank = rank;
    this.moveCount = moveCount;
    this.type = type;
  }

  executeMove(move, board) {
    if (this.name == `Pawn` && this.isPromotionMove(move, board)) {
      console.log(`Is promotion move!`);
      board.twoDArray[move.prevLoc[0] - 1][move.prevLoc[1] - 1] = new Empty(
        move.prevLoc[0],
        move.prevLoc[1],
        0,
        "None"
      );
      //This part needs to be updated to allow the user to pick the type of the promoted piece.
      board.twoDArray[move.curLoc[0] - 1][move.curLoc[1] - 1] = new Queen(
        move.curLoc[0],
        move.curLoc[1],
        0,
        this.type
      );
    } else {
      //replace old spot with Empty
      board.twoDArray[move.prevLoc[0] - 1][move.prevLoc[1] - 1] = new Empty(
        move.prevLoc[0],
        move.prevLoc[1],
        0,
        "None"
      );

      //replace new spot with current Pawn
      board.twoDArray[move.curLoc[0] - 1][move.curLoc[1] - 1] = this;
    }
    //change file
    this.file = move.curLoc[0];

    //change rank
    this.rank = move.curLoc[1];

    this.moveCount++;

    if (board.turn == `White`) {
      board.turn = `Black`;
    } else if (board.turn == `Black`) {
      board.turn = `White`;
    }
  }
  needsExternalMove(move, board) {
    return false;
  }

  isValidDestination(move, board) {
    //not same color or king
    let target = board.getPiece(move.curLoc[0], move.curLoc[1]);
    if (target.type != this.type && target.name != `King`) {
      return true;
    }
    return false;
  }

  getPath(move) {
    //returns an array with all the moves along the path
    //does not include curLoc or prevLoc

    let startingX = move.prevLoc[0];
    let startingY = move.prevLoc[1];
    let finalX = move.curLoc[0];
    let finalY = move.curLoc[1];
    let deltaX = finalX - startingX;
    let deltaY = finalY - startingY;

    const path = [[startingX, startingY]];

    if (move.piece == `Knight`) {
      return path;
    }

    else if (move.piece == `Cavalier`) {
      if (deltaX == 2) {
        path.push([startingX + 1, startingY]);
      }
      if (deltaX == -2) {
        path.push([startingX - 1, startingY]);
      }
      if (deltaY == 2) {
        path.push([startingX, startingY + 1]);
      }
      if (deltaY == -2) {
        path.push([startingX, startingY - 1]);
      }
    }
    
    else if (move.piece == `Nightrider`) {
      let stepX = 1;
      let stepY = 1;
      if (deltaX < 0) {
        stepX *= -1;
      }
      if (deltaY < 0) {
        stepY *= -1;
      }

      if (abs(deltaY / deltaX) == 2) {
        stepY *= 2;
        for (let i = 1; i < abs(deltaX); i++) {
          path.push([startingX + i * stepX, startingY + i * stepY]);
        }
      }
      else if (abs(deltaX / deltaY) == 2) {
        stepX *= 2;
        for (let i = 1; i < abs(deltaY); i++) {
          path.push([startingX + i * stepX, startingY + i * stepY]);
        }
      }
      return path;
    }

    //to avoid errors
    if (deltaX == 0 && deltaY == 0) {
      return path;
    }

    //vertical move
    if (deltaX == 0) {
      let polarity = deltaY / abs(deltaY);
      for (let i = 1; i < abs(deltaY); i++) {
        path.push([startingX, startingY + polarity * i]);
      }
      return path;
    }

    //horizontal move
    else if (deltaY == 0) {
      let polarity = deltaX / abs(deltaX);
      for (let i = 1; i < abs(deltaX); i++) {
        path.push([startingX + polarity * i, startingY]);
      }
      return path;
    }

    //diagonal right move
    else if (deltaX == deltaY) {
      let polarity = deltaX / abs(deltaX);
      for (let i = 1; i < abs(deltaX); i++) {
        path.push([startingX + i * polarity, startingY + i * polarity]);
      }
      return path;
    }

    //diagonal left move
    else if (deltaX == -1 * deltaY) {
      let polarity = deltaX / abs(deltaX);
      for (let i = 1; i < abs(deltaX); i++) {
        path.push([startingX + i * polarity, startingY - i * polarity]);
      }
      return path;
    }
    return path;
  }

  isPathBlocked(move, board) {
    let path = this.getPath(move);
    if (path.length == 1) {
      return false;
    }
    for (let i = 1; i < path.length; i++) {
      if (board.getPiece(path[i][0], path[i][1]).name != `Empty`) {
        return true;
      }
    }
    return false;
  }

  getAllValidMoves(board) {
    //returns array with all reachable squares
    const inRange = this.getAllMovesInRange();
    const validMoves = [];

    for (let i = 0; i < inRange.length; i++) {
      let testMove = {
        piece: this.name,
        prevLoc: [this.file, this.rank],
        curLoc: [inRange[i][0], inRange[i][1]],
      };
      if (this.isValidMove(testMove, board)) {
        validMoves.push(testMove.curLoc);
      }
    }
    return validMoves;
  }
}
