import React from 'react';
import styled from 'styled-components';
import Square from './Square';
import { ChessboardProps } from '../models/types';
import { coordsToSquare } from '../utils/chess-utils';

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 100%;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
`;

const BoardWrapper = styled.div`
  width: 600px;
  height: 600px;
  max-width: 90vw;
  max-height: 90vw;
  position: relative;
  
  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
  }
  
  @media (max-width: 480px) {
    width: 320px;
    height: 320px;
  }
`;

const Coordinates = styled.div<{ isFile?: boolean }>`
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 0.8rem;
  color: #555;
  font-weight: bold;
  
  ${({ isFile }) => isFile 
    ? `
      bottom: -25px;
      left: 0;
      right: 0;
      flex-direction: row;
    `
    : `
      top: 0;
      bottom: 0;
      left: -25px;
      flex-direction: column;
    `
  }
`;

const Chessboard: React.FC<ChessboardProps> = ({
  position,
  onSquareClick,
  selectedSquare,
  possibleMoves,
  turn,
  status,
  aiThinking
}) => {
  // Render the chessboard squares
  const renderSquares = () => {
    const squares = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isBlack = (row + col) % 2 !== 0;
        const squarePosition = coordsToSquare(row, col);
        const piece = position[row][col];
        const isSelected = selectedSquare === squarePosition;
        const isPossibleMove = possibleMoves.includes(squarePosition);
        
        squares.push(
          <Square
            key={squarePosition}
            piece={piece}
            black={isBlack}
            position={squarePosition}
            selected={isSelected}
            isPossibleMove={isPossibleMove}
            onClick={() => onSquareClick(squarePosition)}
          />
        );
      }
    }
    
    return squares;
  };
  
  // Render file coordinates (a-h)
  const renderFileCoordinates = () => {
    return (
      <Coordinates isFile>
        {'abcdefgh'.split('').map(file => (
          <span key={file}>{file}</span>
        ))}
      </Coordinates>
    );
  };
  
  // Render rank coordinates (1-8)
  const renderRankCoordinates = () => {
    return (
      <Coordinates>
        {[...Array(8)].map((_, i) => (
          <span key={i}>{8 - i}</span>
        ))}
      </Coordinates>
    );
  };
  
  return (
    <BoardWrapper>
      {renderRankCoordinates()}
      <BoardContainer>
        {renderSquares()}
      </BoardContainer>
      {renderFileCoordinates()}
    </BoardWrapper>
  );
};

export default Chessboard; 