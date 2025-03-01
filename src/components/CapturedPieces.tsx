import React from 'react';
import styled from 'styled-components';
import { CapturedPiecesProps, Piece } from '../models/types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.div`
  font-weight: 600;
  color: #333;
  width: 60px;
`;

const PiecesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  min-height: 30px;
  align-items: center;
`;

const PieceImage = styled.img`
  width: 30px;
  height: 30px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const MaterialAdvantage = styled.div<{ advantage: number }>`
  margin-left: auto;
  font-weight: 600;
  color: ${({ advantage }) => 
    advantage > 0 ? '#27ae60' : 
    advantage < 0 ? '#e74c3c' : 
    '#7f8c8d'
  };
`;

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces }) => {
  // Sort pieces by value (pawn, knight/bishop, rook, queen)
  const sortPieces = (pieces: Piece[]) => {
    const pieceOrder = { p: 1, n: 2, b: 3, r: 4, q: 5 };
    return [...pieces].sort((a, b) => 
      (pieceOrder[a.type as keyof typeof pieceOrder] || 0) - 
      (pieceOrder[b.type as keyof typeof pieceOrder] || 0)
    );
  };
  
  // Calculate material advantage
  const calculateAdvantage = () => {
    const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    
    const whiteValue = pieces.w.reduce((sum: number, piece: Piece) => 
      sum + (pieceValues[piece.type as keyof typeof pieceValues] || 0), 0);
      
    const blackValue = pieces.b.reduce((sum: number, piece: Piece) => 
      sum + (pieceValues[piece.type as keyof typeof pieceValues] || 0), 0);
      
    return whiteValue - blackValue;
  };
  
  const whitePieces = sortPieces(pieces.w);
  const blackPieces = sortPieces(pieces.b);
  const advantage = calculateAdvantage();
  
  const formatAdvantage = (advantage: number) => {
    if (advantage === 0) return 'Even';
    const abs = Math.abs(advantage);
    return `${advantage > 0 ? 'White' : 'Black'} +${abs}`;
  };
  
  return (
    <Container>
      <Row>
        <Label>White:</Label>
        <PiecesRow>
          {whitePieces.map((piece, index) => (
            <PieceImage
              key={index}
              src={`${process.env.PUBLIC_URL}/assets/pieces/${piece.color}${piece.type}.svg`}
              alt={`${piece.color}${piece.type}`}
            />
          ))}
          {whitePieces.length === 0 && <span>None</span>}
        </PiecesRow>
      </Row>
      
      <Row>
        <Label>Black:</Label>
        <PiecesRow>
          {blackPieces.map((piece, index) => (
            <PieceImage
              key={index}
              src={`${process.env.PUBLIC_URL}/assets/pieces/${piece.color}${piece.type}.svg`}
              alt={`${piece.color}${piece.type}`}
            />
          ))}
          {blackPieces.length === 0 && <span>None</span>}
        </PiecesRow>
      </Row>
      
      <Row>
        <Label>Material:</Label>
        <MaterialAdvantage advantage={advantage}>
          {formatAdvantage(advantage)}
        </MaterialAdvantage>
      </Row>
    </Container>
  );
};

export default CapturedPieces; 