import { Chess, Move as ChessJsMove, Square as ChessJsSquare } from 'chess.js';
import { Piece, PieceColor, Move, GameStatus } from '../models/types';

// Convert FEN position to our board representation
export const fenToBoard = (fen: string): (Piece | null)[][] => {
  const chess = new Chess(fen);
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = `${'abcdefgh'[col]}${8 - row}` as ChessJsSquare;
      const piece = chess.get(square);
      
      if (piece) {
        board[row][col] = {
          type: piece.type as Piece['type'],
          color: piece.color as Piece['color']
        };
      }
    }
  }
  
  return board;
};

// Convert algebraic notation to coordinates
export const squareToCoords = (square: string): [number, number] => {
  const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(square[1]);
  return [row, col];
};

// Convert coordinates to algebraic notation
export const coordsToSquare = (row: number, col: number): string => {
  return `${'abcdefgh'[col]}${8 - row}`;
};

// Get possible moves for a piece
export const getPossibleMoves = (chess: Chess, square: string): string[] => {
  const moves = chess.moves({ square: square as ChessJsSquare, verbose: true }) as ChessJsMove[];
  return moves.map(move => move.to);
};

// Check if a move is valid
export const isValidMove = (chess: Chess, from: string, to: string): boolean => {
  const moves = chess.moves({ square: from as ChessJsSquare, verbose: true }) as ChessJsMove[];
  return moves.some(move => move.to === to);
};

// Make a move on the chess board
export const makeMove = (chess: Chess, from: string, to: string): boolean => {
  try {
    const moveResult = chess.move({ from: from as ChessJsSquare, to: to as ChessJsSquare, promotion: 'q' });
    return !!moveResult;
  } catch (e) {
    return false;
  }
};

// Get game status
export const getGameStatus = (chess: Chess): GameStatus => {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isCheck()) return 'check';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isDraw()) return 'draw';
  return 'playing';
};

// Minimax algorithm with alpha-beta pruning for AI
export const findBestMove = (chess: Chess, depth: number): Move | null => {
  const originalFen = chess.fen();
  let bestMove: Move | null = null;
  let bestScore = -Infinity;
  const moves = chess.moves({ verbose: true }) as ChessJsMove[];
  
  // Randomize moves to add variety
  shuffleArray(moves);
  
  for (const move of moves) {
    chess.move(move);
    const score = -minimax(chess, depth - 1, -Infinity, Infinity, false);
    chess.load(originalFen);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = { from: move.from, to: move.to };
    }
  }
  
  return bestMove;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  chess: Chess, 
  depth: number, 
  alpha: number, 
  beta: number, 
  isMaximizingPlayer: boolean
): number => {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }
  
  const moves = chess.moves({ verbose: true }) as ChessJsMove[];
  
  if (isMaximizingPlayer) {
    let maxScore = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
};

// Evaluate the board position
const evaluateBoard = (chess: Chess): number => {
  // Material value
  const pieceValues = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900
  };
  
  // Position evaluation tables for each piece type
  const pawnEvalWhite = [
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
    [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
    [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
    [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
    [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
    [0.5,  1.0,  1.0, -2.0, -2.0,  1.0,  1.0,  0.5],
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
  ];
  
  const knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
    [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
    [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
    [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
    [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
    [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
  ];
  
  const bishopEvalWhite = [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [-1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [-1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [-1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [-1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
  ];
  
  const rookEvalWhite = [
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [0.0,  0.0,  0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
  ];
  
  const queenEval = [
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [-0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [-1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [-1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
  ];
  
  const kingEvalWhite = [
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
    [2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
  ];
  
  // Mirror tables for black pieces
  const pawnEvalBlack = pawnEvalWhite.slice().reverse();
  const bishopEvalBlack = bishopEvalWhite.slice().reverse();
  const rookEvalBlack = rookEvalWhite.slice().reverse();
  const kingEvalBlack = kingEvalWhite.slice().reverse();
  
  let score = 0;
  
  // Evaluate each piece on the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = coordsToSquare(row, col) as ChessJsSquare;
      const piece = chess.get(square);
      
      if (!piece) continue;
      
      // Base material value
      const materialValue = pieceValues[piece.type as keyof typeof pieceValues] || 0;
      const positionValue = getPositionValue(piece.type, piece.color, row, col);
      
      // Add to score if white, subtract if black
      const value = materialValue + positionValue;
      score += piece.color === 'w' ? value : -value;
    }
  }
  
  // Add bonus for checkmate and check
  if (chess.isCheckmate()) {
    score += chess.turn() === 'w' ? -1000 : 1000;
  } else if (chess.isCheck()) {
    score += chess.turn() === 'w' ? -50 : 50;
  }
  
  // Return score from white's perspective
  return score;
  
  // Helper function to get position value
  function getPositionValue(type: string, color: string, row: number, col: number): number {
    switch (type) {
      case 'p':
        return color === 'w' ? pawnEvalWhite[row][col] : pawnEvalBlack[row][col];
      case 'n':
        return knightEval[row][col];
      case 'b':
        return color === 'w' ? bishopEvalWhite[row][col] : bishopEvalBlack[row][col];
      case 'r':
        return color === 'w' ? rookEvalWhite[row][col] : rookEvalBlack[row][col];
      case 'q':
        return queenEval[row][col];
      case 'k':
        return color === 'w' ? kingEvalWhite[row][col] : kingEvalBlack[row][col];
      default:
        return 0;
    }
  }
};

// Shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Get captured pieces
export const getCapturedPieces = (chess: Chess): { w: Piece[], b: Piece[] } => {
  const history = chess.history({ verbose: true }) as ChessJsMove[];
  const captured: { w: Piece[], b: Piece[] } = { w: [], b: [] };
  
  history.forEach(move => {
    if (move.captured) {
      const piece: Piece = {
        type: move.captured as Piece['type'],
        color: move.color === 'w' ? 'b' : 'w'
      };
      
      if (piece.color === 'w') {
        captured.w.push(piece);
      } else {
        captured.b.push(piece);
      }
    }
  });
  
  return captured;
}; 