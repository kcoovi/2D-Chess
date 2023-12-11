// scripts.js
document.addEventListener("DOMContentLoaded", function () {
  const chessboard = document.getElementById("chessboard");
  let draggedPiece = null;

  // Function to check if a square is occupied
  function squareOccupied(row, col) {
    const square = chessboard.querySelector(
      `.square[data-row="${row}"][data-col="${col}"]`
    );
    return square.innerHTML.trim() !== "";
  }

  // Helper function to check if a move is within the board boundaries
  function isMoveWithinBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  // Helper function to generate static URLs
  function url_for_static(filename) {
    return `/static/img/${filename}`;
  }

  // Validate moves for different pieces
  function isMoveValid(piece, startSquare, endSquare) {
    const startRow = parseInt(startSquare.dataset.row);
    const startCol = parseInt(startSquare.dataset.col);
    const endRow = parseInt(endSquare.dataset.row);
    const endCol = parseInt(endSquare.dataset.col);
    const rowDiff = Math.abs(endRow - startRow);
    const colDiff = Math.abs(endCol - startCol);

    switch (piece.toLowerCase()) {
      case "p":
        // Pawn rules
        const direction = piece[0] === "w" ? 1 : -1;
        if (colDiff === 0) {
          // Moving forward
          if (!squareOccupied(endRow, endCol)) {
            if (
              (rowDiff === 1 && direction === 1) ||
              (rowDiff === 2 && direction === 1 && startRow === 1) ||
              (rowDiff === 1 && direction === -1) ||
              (rowDiff === 2 && direction === -1 && startRow === 6)
            ) {
              return true;
            }
          }
        } else if (colDiff === 1 && rowDiff === 1) {
          // Capturing diagonally
          return squareOccupied(endRow, endCol);
        } else {
          return false;
        }

      case "r":
        // Rook rules
        return startRow === endRow || startCol === endCol;

      case "n":
        // Knight rules
        return (
          (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)
        );

      case "b":
        // Bishop rules
        return rowDiff === colDiff;

      case "q":
        // Queen rules
        return (
          startRow === endRow || startCol === endCol || rowDiff === colDiff
        );

      case "k":
        // King rules
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return true; // Default to allowing the move if the piece type is not recognized
    }
  }

  // Handle drag start
  function handleDragStart(event) {
    const target = event.target;
    if (target.classList.contains("square") && target.innerHTML !== "") {
      draggedPiece = target;
      event.dataTransfer.setData("text/plain", target.innerHTML);
    }
  }

  // Handle drag over
  function handleDragOver(event) {
    event.preventDefault();
  }

  // Handle drop
  function handleDrop(event) {
    event.preventDefault();
    const target = event.target;

    // Check if the move is valid for the specific piece type
    if (isMoveValid(draggedPiece.innerHTML, draggedPiece, target)) {
      target.innerHTML = event.dataTransfer.getData("text/plain");
      draggedPiece.innerHTML = "";
    }
  }

  // Initialize the chessboard with pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 0 ? "light" : "dark");
      square.dataset.row = row;
      square.dataset.col = col;

      // Add chess pieces
      if (row === 0 || row === 7) {
        const pieceColor = row === 0 ? "b" : "w";
        const pieceType = ["R", "N", "B", "Q", "K", "B", "N", "R"][col % 8];
        const pieceImage = `${pieceColor}${pieceType.toLowerCase()}.png`;
        square.innerHTML = `<div class="piece" style="background-image: url('${url_for_static(
          pieceImage
        )}')"></div>`;
      }
      if (row === 1 || row === 6) {
        const pieceColor = row === 1 ? "b" : "w";
        const pieceType = "P";
        const pieceImage = `${pieceColor}${pieceType.toLowerCase()}.png`;
        square.innerHTML = `<div class="piece" style="background-image: url('${url_for_static(
          pieceImage
        )}')"></div>`;
      }

      chessboard.appendChild(square);

      // Enable drag and drop for chess pieces
      square.draggable = true;
      square.addEventListener("dragstart", handleDragStart);
      square.addEventListener("dragover", handleDragOver);
      square.addEventListener("drop", handleDrop);
    }
  }

  // Check if the new game button already exists
  const existingNewGameButton = document.getElementById("newGameButton");

  // Create a new game button if it doesn't exist
  if (!existingNewGameButton) {
    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New Game";
    newGameButton.id = "newGameButton";
    newGameButton.addEventListener("click", startNewGame);
    document.body.appendChild(newGameButton);
  }
});
