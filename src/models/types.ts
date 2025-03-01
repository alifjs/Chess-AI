export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Square {
  x: number;
  y: number;
}

export interface Move {
  from: string;
  to: string;
  promotion?: string;
}

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export interface GameState {
  board: (Piece | null)[][];
  turn: PieceColor;
  status: GameStatus;
  history: Move[];
  selectedSquare: string | null;
  possibleMoves: string[];
  aiThinking: boolean;
  capturedPieces: {
    w: Piece[];
    b: Piece[];
  };
}

export interface ChessboardProps {
  position: (Piece | null)[][];
  onSquareClick: (square: string) => void;
  selectedSquare: string | null;
  possibleMoves: string[];
  turn: PieceColor;
  status: GameStatus;
  aiThinking: boolean;
}

export interface SquareProps {
  piece: Piece | null;
  black: boolean;
  position: string;
  selected: boolean;
  isPossibleMove: boolean;
  onClick: () => void;
}

export interface GameControlsProps {
  onNewGame: () => void;
  onUndoMove: () => void;
  status: GameStatus;
  turn: PieceColor;
  aiThinking: boolean;
}

export interface CapturedPiecesProps {
  pieces: {
    w: Piece[];
    b: Piece[];
  };
}

export interface GameInfoProps {
  status: GameStatus;
  turn: PieceColor;
  aiThinking: boolean;
}

export interface DifficultyLevel {
  label: string;
  depth: number;
}

export interface DifficultySelectProps {
  difficulty: DifficultyLevel;
  onChange: (difficulty: DifficultyLevel) => void;
  disabled: boolean;
} 