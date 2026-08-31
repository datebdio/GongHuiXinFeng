import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mini = path.join(root, 'apps/miniprogram');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const app = readJson(path.join(mini, 'app.json'));
const pkg = readJson(path.join(mini, 'package.json'));
const errors = [];

if (pkg.dependencies?.['tdesign-miniprogram'] !== '1.16.0') errors.push('TDesign version must be pinned to 1.16.0');
for (const page of app.pages || []) {
  for (const ext of ['ts', 'wxml', 'wxss', 'json']) {
    const file = path.join(mini, `${page}.${ext}`);
    if (!fs.existsSync(file)) errors.push(`missing ${path.relative(root, file)}`);
  }
}

const jsonFiles = [];
const walkJson = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', 'miniprogram_npm'].includes(entry.name)) walkJson(full);
    else if (entry.isFile() && entry.name.endsWith('.json')) jsonFiles.push(full);
  }
};
walkJson(mini);
for (const file of jsonFiles) {
  try { readJson(file); } catch (error) { errors.push(`invalid json ${path.relative(root, file)}: ${error.message}`); }
}

const requiredPages = ['pages/login/index','pages/auth/index','pages/home/index','pages/learn-detail/index','pages/quiz/index','pages/result/index','pages/shop/index','pages/product/index','pages/profile/index'];
for (const page of requiredPages) if (!app.pages.includes(page)) errors.push(`app.json missing ${page}`);

const allTextFiles = [];
const wxmlFiles = [];
const walkText = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules','miniprogram_npm'].includes(entry.name)) walkText(full);
    else if (entry.isFile() && /\.(ts|wxml|wxss)$/.test(entry.name)) {
      allTextFiles.push(full);
      if (entry.name.endsWith('.wxml')) wxmlFiles.push(full);
    }
  }
};
walkText(mini);
for (const file of allTextFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (/https?:\/\//.test(text)) errors.push(`prototype should not depend on remote runtime asset: ${path.relative(root, file)}`);
}

const voidTags = new Set(['br', 'image', 'input', 'icon']);
for (const file of wxmlFiles) {
  const text = fs.readFileSync(file, 'utf8').replace(/<!--[^]*?-->/g, '').replace(/\{\{[^]*?\}\}/g, 'VALUE');
  const stack = [];
  const tags = text.match(/<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*?)?\/?\s*>/g) || [];
  for (const raw of tags) {
    const close = /^<\//.test(raw);
    const name = raw.match(/^<\/?([A-Za-z][A-Za-z0-9-]*)/)?.[1];
    if (!name || voidTags.has(name) || /\/\s*>$/.test(raw)) continue;
    if (!close) stack.push(name);
    else {
      const expected = stack.pop();
      if (expected !== name) { errors.push(`unbalanced WXML ${path.relative(root, file)}: expected </${expected}> got </${name}>`); break; }
    }
  }
  if (stack.length) errors.push(`unclosed WXML tag ${path.relative(root, file)}: ${stack[stack.length - 1]}`);
}

if (!app.usingComponents?.['t-button']?.includes('tdesign-miniprogram')) errors.push('app.json must wire TDesign t-button');
if (!fs.readFileSync(path.join(mini, 'styles/tokens.wxss'), 'utf8').includes('--td-brand-color: #d92b2b')) errors.push('TDesign brand color token not overridden');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`validated ${app.pages.length} pages, ${jsonFiles.length} json files, ${wxmlFiles.length} WXML templates, TDesign ${pkg.dependencies['tdesign-miniprogram']}`);
