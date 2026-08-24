const { execSync } = require('child_process');
const path = require('path');
const ghpages = require('gh-pages');

process.env.GITHUB_PAGES = 'true';
console.log('[QuickInstall Hub] Building Next.js static export for GitHub Pages...');
execSync('npx next build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });

console.log('[QuickInstall Hub] Publishing to GitHub Pages branch (gh-pages)...');
ghpages.publish(path.resolve(__dirname, '../out'), { dotfiles: true }, (err) => {
  if (err) {
    console.error('[QuickInstall Hub] Deployment error:', err);
    process.exit(1);
  }
  console.log('✅ Successfully published to GitHub Pages!');
  console.log('🔗 URL: https://qwicklabs-01.github.io/Quickinstall-hub/');
});
