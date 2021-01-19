function legalMove(piece, targetX, targetY) {
    if (piece.name === "pawn") {
        if (piece.color == "white") {
            if (targetY === piece.boardY - 1 && targetX == piece.boardX) {
                return true;
            }
            if (targetY === piece.boardY - 2 && targetX == piece.boardX && !piece.hasMoved) {
                return true;
            }
            if (targetY === piece.boardY - 1 && Math.abs(targetX - piece.boardX) === 1) {
                return true;
            }
        }
        if (piece.color == "black") {
            if (targetY === piece.boardY + 1 && targetX == piece.boardX) {
                return true;
            }
            if (targetY === piece.boardY + 2 && targetX == piece.boardX && !piece.hasMoved) {
                return true;
            }
            if (targetY === piece.boardY + 1 && Math.abs(targetX - piece.boardX) === 1) {
                return true;
            }
        }
    }
    return false;
}