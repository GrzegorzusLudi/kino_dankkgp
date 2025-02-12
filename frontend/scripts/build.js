/* eslint-disable @typescript-eslint/no-require-imports */

const { execSync } = require('node:child_process');
const { print } = require('./print');
const { existsSync, mkdirSync } = require('node:fs');
const { normalize } = require('node:path');
const cpy = require('cpy');
const { deleteAsync } = require('del');
const { replaceInFile } = require('replace-in-file');
const { cwd } = require('node:process');

async function build() {
  execSync(`ng build`, (error, stdout, stderr) => print(error, stdout, stderr));

  const STATIC_PATH = normalize('./dist/browser/static');
  const DIST_PATH = normalize('./dist/browser');
  const FILES = [
    normalize(DIST_PATH + '/*.css'),
    normalize(DIST_PATH + '/*.js'),
    normalize(DIST_PATH + '/*.ico'),
  ];

  if (!existsSync(STATIC_PATH)) {
    mkdirSync(STATIC_PATH);
  }

  await cpy.default(FILES, STATIC_PATH);

  await deleteAsync(FILES);

  replaceInFile({
    files: normalize(cwd() + '/' + DIST_PATH + '/index.html'),
    from: [
      'src="main-',
      'src="polyfills-',
      'href="favicon.ico"',
      ' href="styles-',
    ],
    to: [
      'src="static/main-',
      'src="static/polyfills-',
      'href="static/favicon.ico"',
      ' href="static/styles-',
    ],
  });
}

build();
