import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, copyFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialData } from '../src/data/initialData.js';

/**
 * Copy only verified compiled release files into the Git checkout root.
 * Hostinger's legacy Git integration serves the checkout itself, not dist/.
 * This step NEVER deletes files, never touches secrets, and refuses to replace
 * any existing master product/image bytes with different ones, while allowing
 * previously absent original assets to be introduced unchanged.
 *
 * Use only on a temporary staging checkout, after npm run build and QA.
 * Production is updated later by a separately approved Git merge/release.
 */
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
const touched = [];

const digest = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const mustExist = (path) => {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error('Required release file is missing: ' + path);
  }
};

function publish(relativePath, { immutable = false, requiredExisting = false } = {}) {
  if (relativePath.startsWith('/') || relativePath.split('/').some((part) => part === '..' || part === '.')) {
    throw new Error('Invalid release path: ' + relativePath);
  }
  const sourcePath = join(dist, relativePath);
  const targetPath = join(root, relativePath);
  mustExist(sourcePath);

  const alreadyExists = existsSync(targetPath);
  // A newly approved asset may exist in dist/public but not yet in root.
  // Adding those exact source bytes is safe; changing an existing original is not.
  if (requiredExisting && !alreadyExists) {
    console.log('Adding new original asset without transformation:', relativePath);
  }
  if (alreadyExists && (immutable || requiredExisting)) {
    if (digest(sourcePath) !== digest(targetPath)) {
      throw new Error('Original/immutable file mismatch — refusing to alter: ' + relativePath);
    }
    return;
  }
  mkdirSync(dirname(targetPath), { recursive: true });
  if (alreadyExists && digest(sourcePath) === digest(targetPath)) return;
  copyFileSync(sourcePath, targetPath);
  touched.push(relativePath);
}

function walk(relativePath, fn) {
  const path = join(dist, relativePath);
  if (!existsSync(path)) throw new Error('Missing release folder: ' + relativePath);
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const item = relativePath + '/' + entry.name;
    if (entry.isDirectory()) walk(item, fn);
    else if (entry.isFile()) fn(item);
    else throw new Error('Unexpected non-file in release output: ' + item);
  }
}

mustExist(join(dist, 'deployment.json'));
const marker = JSON.parse(readFileSync(join(dist, 'deployment.json'), 'utf8'));
if (marker.productCount !== initialData.products.length || marker.productCount !== 38) {
  throw new Error('Release marker/catalog count does not match the reviewed 38-pack catalog');
}

const apache = readFileSync(join(dist, '.htaccess'), 'utf8');
if (!apache.includes('.github') || !apache.includes('zip|sql|bak')) {
  throw new Error('Refusing to publish release without source/archive access protection');
}

// Preserve old hashed assets. Upload only NEW hashes; an existing hash must
// have byte-for-byte identical content.
walk('assets', (path) => publish(path, { immutable: true }));

// Root HTML and safety/crawler metadata are the intentionally replaceable
// public entrypoints. They are versioned by Git, allowing a limited rollback.
for (const path of [
  'index.html', '.htaccess', 'robots.txt', 'sitemap.xml',
  'deployment.json', 'seo-manifest.json',
  'products/index.html', 'about/index.html', 'contact/index.html', 'finder/index.html'
]) publish(path);

for (const product of initialData.products) {
  publish('products/' + product.id + '/index.html');
}

// Approved original product pack imagery cannot change by even one byte.
walk('products', (path) => {
  if (path.endsWith('.webp') || path.endsWith('.png') || path.endsWith('.jpg')) {
    publish(path, { requiredExisting: true });
  }
});
walk('images', (path) => {
  if (path.endsWith('.webp') || path.endsWith('.png') || path.endsWith('.jpg')) {
    publish(path, { requiredExisting: true });
  }
});
for (const logo of ['logo.png', 'logo-dark-bg.png']) {
  if (existsSync(join(dist, logo))) publish(logo, { requiredExisting: true });
}

const entry = readFileSync(join(root, 'index.html'), 'utf8');
if (!entry.includes('/assets/') || !entry.includes('<div id="root"></div>')) {
  throw new Error('Refusing to stage an incomplete production HTML entrypoint');
}

console.log('Prepared Git-hosted static release:');
console.log('  product detail pages:', initialData.products.length);
console.log('  new/updated files:', touched.length);
console.log('  preserved existing original artwork and old hashed bundles');
console.log('  release identity:', marker.commit);
// No deployment, file deletion, Git commit or network access occurs in this script.
