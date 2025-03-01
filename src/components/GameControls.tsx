import React from 'react';
import styled from 'styled-components';
import { GameControlsProps, DifficultyLevel, DifficultySelectProps } from '../models/types';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ primary }) => primary ? '#4a6fa5' : '#e0e0e0'};
  color: ${({ primary }) => primary ? 'white' : '#333'};
  
  &:hover {
    background-color: ${({ primary }) => primary ? '#3a5a8c' : '#d0d0d0'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
    transform: none;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const DifficultySelect: React.FC<DifficultySelectProps> = ({ difficulty, onChange, disabled }) => {
  const difficultyLevels: DifficultyLevel[] = [
    { label: 'Easy', depth: 2 },
    { label: 'Medium', depth: 3 },
    { label: 'Hard', depth: 4 },
    { label: 'Expert', depth: 5 }
  ];
  
  return (
    <SelectContainer>
      <Label htmlFor="difficulty">AI Difficulty:</Label>
      <Select
        id="difficulty"
        value={difficulty.label}
        onChange={(e) => {
          const selected = difficultyLevels.find(d => d.label === e.target.value);
          if (selected) onChange(selected);
        }}
        disabled={disabled}
      >
        {difficultyLevels.map((level) => (
          <option key={level.label} value={level.label}>
            {level.label}
          </option>
        ))}
      </Select>
    </SelectContainer>
  );
};

const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndoMove,
  status,
  turn,
  aiThinking
}) => {
  const [difficulty, setDifficulty] = React.useState<DifficultyLevel>({ label: 'Medium', depth: 3 });
  
  // Handle new game with current difficulty
  const handleNewGame = () => {
    onNewGame();
  };
  
  const isGameOver = status === 'checkmate' || status === 'stalemate' || status === 'draw';
  
  return (
    <ControlsContainer>
      <ButtonsContainer>
        <Button primary onClick={handleNewGame} disabled={aiThinking}>
          New Game
        </Button>
        <Button onClick={onUndoMove} disabled={aiThinking}>
          Undo Move
        </Button>
      </ButtonsContainer>
      
      <DifficultySelect
        difficulty={difficulty}
        onChange={setDifficulty}
        disabled={aiThinking && !isGameOver}
      />
    </ControlsContainer>
  );
};

export default GameControls; 