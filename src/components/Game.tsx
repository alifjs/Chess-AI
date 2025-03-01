import React, { useState, useCallback } from 'react';
import { Chess, Square as ChessJsSquare } from 'chess.js';
import styled from 'styled-components';
import Chessboard from './Chessboard';
import GameControls from './GameControls';
import GameInfo from './GameInfo';
import CapturedPieces from './CapturedPieces';
import { GameState, PieceColor } from '../models/types';
import { 
  fenToBoard, 
  getPossibleMoves, 
  makeMove, 
  getGameStatus, 
  findBestMove,
  getCapturedPieces
} from '../utils/chess-utils';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const GameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 40px;
  }
`;

const BoardSection = styled.div`
  margin-bottom: 30px;
  
  @media (min-width: 1024px) {
    margin-bottom: 0;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const Game: React.FC = () => {
  const [chess] = useState<Chess>(new Chess());
  const [gameState, setGameState] = useState<GameState>({
    board: fenToBoard(chess.fen()),
    turn: 'w',
    status: 'playing',
    history: [],
    selectedSquare: null,
    possibleMoves: [],
    aiThinking: false,
    capturedPieces: { w: [], b: [] }
  });
  
  const [difficulty, setDifficulty] = useState({ label: 'Medium', depth: 3 });
  
  // Update game state from chess instance
  const updateGameState = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      board: fenToBoard(chess.fen()),
      turn: chess.turn() as PieceColor,
      status: getGameStatus(chess),
      capturedPieces: getCapturedPieces(chess)
    }));
  }, [chess]);
  
  // Make AI move
  const makeAIMove = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      aiThinking: true
    }));
    
    // Use setTimeout to allow UI to update before AI calculation
    setTimeout(() => {
      const bestMove = findBestMove(chess, difficulty.depth);
      
      if (bestMove) {
        makeMove(chess, bestMove.from, bestMove.to);
        updateGameState();
      }
      
      setGameState(prevState => ({
        ...prevState,
        aiThinking: false
      }));
    }, 500);
  }, [chess, difficulty.depth, updateGameState]);
  
  // Handle square click
  const handleSquareClick = useCallback((square: string) => {
    // If AI is thinking, do nothing
    if (gameState.aiThinking) return;
    
    // If game is over, do nothing
    if (gameState.status === 'checkmate' || gameState.status === 'stalemate' || gameState.status === 'draw') {
      return;
    }
    
    // If a square is already selected
    if (gameState.selectedSquare) {
      // If clicking the same square, deselect it
      if (gameState.selectedSquare === square) {
        setGameState(prevState => ({
          ...prevState,
          selectedSquare: null,
          possibleMoves: []
        }));
        return;
      }
      
      // If clicking a possible move square, make the move
      if (gameState.possibleMoves.includes(square)) {
        const moveResult = makeMove(chess, gameState.selectedSquare, square);
        
        if (moveResult) {
          updateGameState();
          
          // Reset selection
          setGameState(prevState => ({
            ...prevState,
            selectedSquare: null,
            possibleMoves: []
          }));
          
          // If the game is not over, make AI move
          if (!chess.isGameOver()) {
            makeAIMove();
          }
        }
        return;
      }
    }
    
    // Check if the clicked square has a piece of the current player's color
    const piece = chess.get(square as ChessJsSquare);
    if (piece && piece.color === chess.turn()) {
      const possibleMoves = getPossibleMoves(chess, square);
      setGameState(prevState => ({
        ...prevState,
        selectedSquare: square,
        possibleMoves
      }));
    }
  }, [chess, gameState.aiThinking, gameState.possibleMoves, gameState.selectedSquare, gameState.status, updateGameState, makeAIMove]);
  
  // Handle new game
  const handleNewGame = useCallback(() => {
    chess.reset();
    updateGameState();
    setGameState(prevState => ({
      ...prevState,
      selectedSquare: null,
      possibleMoves: [],
      aiThinking: false
    }));
  }, [chess, updateGameState]);
  
  // Handle undo move
  const handleUndoMove = useCallback(() => {
    // Undo both player and AI moves
    chess.undo();
    chess.undo();
    updateGameState();
    setGameState(prevState => ({
      ...prevState,
      selectedSquare: null,
      possibleMoves: []
    }));
  }, [chess, updateGameState]);
  
  // Handle difficulty change - not currently used in UI but kept for future implementation
  const handleDifficultyChange = useCallback((newDifficulty: { label: string, depth: number }) => {
    setDifficulty(newDifficulty);
  }, []);
  
  return (
    <GameContainer>
      <GameSection>
        <BoardSection>
          <Chessboard
            position={gameState.board}
            onSquareClick={handleSquareClick}
            selectedSquare={gameState.selectedSquare}
            possibleMoves={gameState.possibleMoves}
            turn={gameState.turn}
            status={gameState.status}
            aiThinking={gameState.aiThinking}
          />
        </BoardSection>
        
        <InfoSection>
          <GameInfo
            status={gameState.status}
            turn={gameState.turn}
            aiThinking={gameState.aiThinking}
          />
          
          <CapturedPieces pieces={gameState.capturedPieces} />
          
          <GameControls
            onNewGame={handleNewGame}
            onUndoMove={handleUndoMove}
            status={gameState.status}
            turn={gameState.turn}
            aiThinking={gameState.aiThinking}
          />
        </InfoSection>
      </GameSection>
    </GameContainer>
  );
};

export default Game;