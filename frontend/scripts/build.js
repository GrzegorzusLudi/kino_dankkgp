const { execSync } = require('node:child_process');
const { existsSync, mkdirSync } = require('node:fs');
const { normalize } = require('node:path');
const { default: copy } = require('cpy');
const { deleteAsync } = require('del');
const { replaceInFile } = require('replace-in-file');
const { cwd } = require('node:process');

function print(error, stdout, stderr, printStdErr) {
  if (error) {
    console.error(`exec error: ${error}`);
  }

  if (stdout.length && stdout.trim().length) {
    console.log(stdout);
  }

  if (printStdErr && stderr) {
    console.error(stderr);
  }
}

async function build() {
  console.log('Executing ng build');

  execSync(`ng build`, (error, stdout, stderr) => print(error, stdout, stderr));

  const FRONTEND_DIST_PATH = normalize(cwd() + '/dist/browser');
  const FRONTEND_STATIC_PATH = normalize(cwd() + '/dist/browser/static');
  const BACKEND_HTML_PATH = normalize(cwd() + '/../server/templates');
  const BACKEND_STATIC_PATH = normalize(cwd() + '/../server/static');

  const HTML_FILES = [normalize(FRONTEND_DIST_PATH + '/index.html')];
  const STATIC_FILES = [
    normalize(FRONTEND_DIST_PATH + '/*.css'),
    normalize(FRONTEND_DIST_PATH + '/*.js'),
    normalize(FRONTEND_DIST_PATH + '/*.ico'),
  ];

  if (!existsSync(FRONTEND_STATIC_PATH)) {
    mkdirSync(FRONTEND_STATIC_PATH);
  }

  console.log(`Copying static files to ${FRONTEND_STATIC_PATH}`);

  await copy(STATIC_FILES, FRONTEND_STATIC_PATH);

  console.log(`Updating src and href attributes in ${HTML_FILES[0]}`);

  await replaceInFile({
    files: normalize(HTML_FILES[0]),
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

  console.log(`Copying index.html to ${BACKEND_HTML_PATH}`);

  await copy(HTML_FILES, BACKEND_HTML_PATH, { flat: true });

  console.log(`Copying static files to ${BACKEND_STATIC_PATH}`);

  await copy(STATIC_FILES, BACKEND_STATIC_PATH);

  console.log(`Delete static files in ${FRONTEND_DIST_PATH}`);

  await deleteAsync(STATIC_FILES);
}

build();
