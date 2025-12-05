const fs = require('fs');
const path = require('path');

const nextDir = path.join(process.cwd(), '.next');

if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✓ Cleaned .next folder');
  } catch (error) {
    console.error('Failed to clean .next folder:', error.message);
    process.exit(1);
  }
} else {
  console.log('✓ .next folder does not exist');
}

