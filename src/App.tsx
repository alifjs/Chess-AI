import React from 'react';
import styled from 'styled-components';
import Game from './components/Game';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #34495e;
  margin: 0;
`;

const Footer = styled.footer`
  margin-top: 30px;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header>
        <Title>Chess AI</Title>
        <Subtitle>Play against a smart chess engine</Subtitle>
      </Header>
      
      <Game />
      
      <Footer>
        <p>Created with React and chess.js</p>
      </Footer>
    </AppContainer>
  );
};

export default App;
