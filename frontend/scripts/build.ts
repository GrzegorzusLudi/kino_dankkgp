import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { normalize } from 'node:path';
import { default as copy } from 'cpy';
import { deleteAsync } from 'del';
import { replaceInFile } from 'replace-in-file';
import { cwd } from 'node:process';

async function build() {
  console.log('Executing ng build');

  execSync(`ng build`);

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

  console.log(`Deleting static files in ${FRONTEND_DIST_PATH}`);

  await deleteAsync(STATIC_FILES);

  console.log('Done!')
}

build();
