const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

// Read source files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const js = fs.readFileSync('js/app.js', 'utf8');

// Create dist directory
if (!fs.existsSync('dist')) fs.mkdirSync('dist');
if (!fs.existsSync('dist/fonts')) fs.mkdirSync('dist/fonts');

// Copy fonts
fs.readdirSync('fonts').forEach((font) => {
	fs.copyFileSync(path.join('fonts', font), path.join('dist/fonts', font));
});

// Copy robots.txt
if (fs.existsSync('robots.txt')) {
	fs.copyFileSync('robots.txt', 'dist/robots.txt');
}

// Update CSS font paths for inline use
const inlineCss = css.replace(/\.\.\/fonts\//g, 'fonts/');

// Replace external files with inline content
let distHtml = html
	.replace(/<link rel="preload"[^>]*font[^>]*>/g, '')
	.replace(/<link rel="stylesheet" href="css\/style.css"[^>]*>/, `<style>${inlineCss}</style>`)
	.replace(/<script src="js\/app.js"><\/script>/, `<script>${js}</script>`);

// Minify using html-minifier
try {
	distHtml = minify(distHtml, {
		collapseWhitespace: true,
		removeComments: true,
		minifyCSS: true,
		minifyJS: true,
		processScripts: ['application/ld+json'],
	});
} catch (e) {
	console.error('❌ Minification Error:', e);
	process.exit(1);
}

fs.writeFileSync('dist/index.html', distHtml);

const originalSize = html.length + css.length + js.length;
const distSize = distHtml.length;

const zlib = require('zlib');
const gzipSize = zlib.gzipSync(distHtml).length;

console.log('✅ Build complete!');
console.log(`   Source: ${(originalSize / 1024).toFixed(2)} KB`);
console.log(`   Dist:   ${(distSize / 1024).toFixed(2)} KB (Minified HTML)`);
console.log(`   Gzip:   ${(gzipSize / 1024).toFixed(2)} KB (Transfer size)`);
console.log(`   Saved:  ${((1 - distSize / originalSize) * 100).toFixed(1)}%`);
console.log('\n📁 Output: dist/index.html');
