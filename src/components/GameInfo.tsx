import React from 'react';
import styled from 'styled-components';
import { GameStatus, PieceColor } from '../models/types';

interface GameInfoProps {
  status: GameStatus;
  turn: PieceColor;
  aiThinking: boolean;
}

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StatusText = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
`;

const TurnIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ColorCircle = styled.div<{ color: 'white' | 'black' }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color === 'white' ? '#fff' : '#000'};
  border: 1px solid #333;
  margin-right: 10px;
`;

const ThinkingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-style: italic;
  color: #666;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GameInfo: React.FC<GameInfoProps> = ({ status, turn, aiThinking }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'checkmate':
        return `Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`;
      case 'stalemate':
        return 'Stalemate! The game is a draw.';
      case 'draw':
        return 'Draw! The game is over.';
      case 'check':
        return `${turn === 'w' ? 'White' : 'Black'} is in check!`;
      default:
        return 'Game in progress';
    }
  };

  return (
    <InfoContainer>
      <StatusText>{getStatusMessage()}</StatusText>
      
      {status !== 'checkmate' && status !== 'stalemate' && status !== 'draw' && (
        <TurnIndicator>
          <ColorCircle color={turn === 'w' ? 'white' : 'black'} />
          <span>{turn === 'w' ? 'White' : 'Black'}'s turn</span>
        </TurnIndicator>
      )}
      
      {aiThinking && (
        <ThinkingIndicator>
          <Spinner />
          <span>AI is thinking...</span>
        </ThinkingIndicator>
      )}
    </InfoContainer>
  );
};

export default GameInfo; 