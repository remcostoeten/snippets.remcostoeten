#!/usr/bin/env node

console.log('\x1b[31m%s\x1b[0m', '❌ This repository requires pnpm for managing dependencies.');
console.log('\x1b[36m%s\x1b[0m', 'Please install pnpm: npm install -g pnpm');
console.log('\x1b[36m%s\x1b[0m', 'Then run: pnpm install');
process.exit(1);
