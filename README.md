# Chess AI

A chess game with AI opponent built with React and TypeScript.

## Live site:
https://ai-chessmaster.netlify.app/

## Features

- Play chess against an AI opponent with adjustable difficulty levels
- Beautiful and responsive UI with smooth animations
- Highlights possible moves for selected pieces
- Shows captured pieces and material advantage
- Game status indicators (check, checkmate, stalemate, draw)
- Undo moves

## Technologies Used

- React
- TypeScript
- chess.js (for chess logic)
- styled-components (for styling)
- Minimax algorithm with alpha-beta pruning (for AI)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chess-ai.git
   cd chess-ai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to Play

1. Click on a piece to select it
2. Click on a highlighted square to move the piece
3. The AI will automatically make its move after you
4. Use the "Undo Move" button to take back your last move
5. Use the "New Game" button to start a new game
6. Adjust the AI difficulty using the dropdown menu

## AI Difficulty Levels

- Easy: AI looks 2 moves ahead
- Medium: AI looks 3 moves ahead
- Hard: AI looks 4 moves ahead
- Expert: AI looks 5 moves ahead

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Chess piece SVG images from [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces)
- Chess logic powered by [chess.js](https://github.com/jhlywa/chess.js)
