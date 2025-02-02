import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const images = [
  {
    name: 'template.jpg',
    width: 400,
    height: 300,
    backgroundColor: '#4F46E5',
    text: 'Professional Templates'
  },
  {
    name: 'ai.jpg',
    width: 400,
    height: 300,
    backgroundColor: '#9333EA',
    text: 'AI-Powered Writing'
  },
  {
    name: 'review.jpg',
    width: 400,
    height: 300,
    backgroundColor: '#EC4899',
    text: 'Expert Review'
  }
];

// Create SVG placeholder images
images.forEach(({ name, width, height, backgroundColor, text }) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;

  const filePath = join(__dirname, name);
  writeFileSync(filePath, svg);
});
