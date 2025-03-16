const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function createOgImage() {
  // Create a canvas with OG image dimensions (1200x630)
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Draw decorative circles
  function drawCircle(x, y, radius, color) {
    const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    circleGradient.addColorStop(0, color);
    circleGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = circleGradient;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  drawCircle(100, 100, 300, '#a855f7'); // Purple circle top-left
  drawCircle(1100, 530, 350, '#3b82f6'); // Blue circle bottom-right
  drawCircle(900, 150, 200, '#06b6d4'); // Cyan circle top-right

  // Draw Truthify title
  ctx.font = 'bold 100px sans-serif';
  ctx.textAlign = 'center';
  
  // Create gradient for text
  const textGradient = ctx.createLinearGradient(400, 0, 800, 0);
  textGradient.addColorStop(0, '#a855f7'); // Purple
  textGradient.addColorStop(0.5, '#3b82f6'); // Blue
  textGradient.addColorStop(1, '#06b6d4'); // Cyan
  
  ctx.fillStyle = textGradient;
  ctx.fillText('Truthify', 600, 350);

  // Draw tagline
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Verify if information is real or fake with AI', 600, 420);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'public', 'og-image.png'), buffer);
  
  console.log('OG image created successfully!');
}

createOgImage().catch(console.error);
