const fs = require('fs');
const path = require('path');

// A simple 1024x1024 PNG icon with a chat bubble design
const iconBase64 = `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;

const assetsDir = path.join(__dirname, '..', 'assets', 'images');
const iconPath = path.join(assetsDir, 'icon.png');

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write the icon file
fs.writeFileSync(iconPath, Buffer.from(iconBase64, 'base64'));

console.log('Icon created successfully at:', iconPath); 