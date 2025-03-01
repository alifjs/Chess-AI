const https = require('https');
const fs = require('fs');
const path = require('path');

// Define the pieces to download
const pieces = [
  { color: 'w', type: 'k', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg' },
  { color: 'w', type: 'q', url: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg' },
  { color: 'w', type: 'r', url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg' },
  { color: 'w', type: 'b', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg' },
  { color: 'w', type: 'n', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg' },
  { color: 'w', type: 'p', url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg' },
  { color: 'b', type: 'k', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg' },
  { color: 'b', type: 'q', url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg' },
  { color: 'b', type: 'r', url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg' },
  { color: 'b', type: 'b', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg' },
  { color: 'b', type: 'n', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg' },
  { color: 'b', type: 'p', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg' }
];

// Create the directory if it doesn't exist
const piecesDir = path.join(__dirname, 'public', 'assets', 'pieces');
if (!fs.existsSync(piecesDir)) {
  fs.mkdirSync(piecesDir, { recursive: true });
}

// Download each piece
pieces.forEach(piece => {
  const fileName = `${piece.color}${piece.type}.svg`;
  const filePath = path.join(piecesDir, fileName);
  
  console.log(`Downloading ${fileName}...`);
  
  const file = fs.createWriteStream(filePath);
  
  https.get(piece.url, response => {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${fileName}`);
    });
  }).on('error', err => {
    fs.unlink(filePath);
    console.error(`Error downloading ${fileName}: ${err.message}`);
  });
}); 