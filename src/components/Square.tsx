import React from 'react';
import styled from 'styled-components';
import { SquareProps } from '../models/types';

// Styled components for the chess square
const SquareContainer = styled.div<{
  black: boolean;
  selected: boolean;
  isPossibleMove: boolean;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${({ black, selected, isPossibleMove }) => {
    if (selected) return '#ffcf75';
    if (isPossibleMove) return black ? '#7b9e89' : '#a4c4a8';
    return black ? '#b58863' : '#f0d9b5';
  }};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const PieceImage = styled.div<{ piece: string }>`
  width: 80%;
  height: 80%;
  background-image: url(${({ piece }) => piece});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const PossibleMoveIndicator = styled.div`
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
`;

const Square: React.FC<SquareProps> = ({
  piece,
  black,
  position,
  selected,
  isPossibleMove,
  onClick
}) => {
  // Function to get the piece image URL
  const getPieceImage = (piece: { type: string; color: string }) => {
    const pieceType = piece.type.toLowerCase();
    const pieceColor = piece.color.toLowerCase();
    return `${process.env.PUBLIC_URL}/assets/pieces/${pieceColor}${pieceType}.svg`;
  };

  return (
    <SquareContainer
      black={black}
      selected={selected}
      isPossibleMove={isPossibleMove}
      onClick={onClick}
      data-testid={`square-${position}`}
    >
      {piece && <PieceImage piece={getPieceImage(piece)} />}
      {!piece && isPossibleMove && <PossibleMoveIndicator />}
    </SquareContainer>
  );
};

export default Square; 