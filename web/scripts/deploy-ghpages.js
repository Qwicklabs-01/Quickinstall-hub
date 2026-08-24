const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ghpages = require('gh-pages');

process.env.GITHUB_PAGES = 'true';
console.log('[QuickInstall Hub] Building Next.js static export for GitHub Pages...');
execSync('npx next build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

// Crucial: Create .nojekyll in the out directory so GitHub Pages serves _next static folders without 404
const outDir = path.resolve(__dirname, '../out');
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

console.log('[QuickInstall Hub] Publishing to GitHub Pages branch (gh-pages) with dotfiles enabled...');
ghpages.publish(outDir, { dotfiles: true, history: false }, (err) => {
  if (err) {
    console.error('[QuickInstall Hub] Deployment error:', err);
    process.exit(1);
  }
  console.log('✅ Successfully published to GitHub Pages!');
  console.log('🔗 URL: https://qwicklabs-01.github.io/Quickinstall-hub/');
});
