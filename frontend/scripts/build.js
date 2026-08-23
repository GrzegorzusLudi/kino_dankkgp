import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from 'node:fs';
import { normalize } from 'node:path';
import { cwd } from 'node:process';

import copy from 'cpy';
import { deleteAsync } from 'del';
import { noop } from 'lodash-es';
import { replaceInFile } from 'replace-in-file';
import { match } from 'ts-pattern';

async function build() {
  const FRONTEND_DIST_PATH = normalize(`${cwd()}/dist/apps/browser/browser`);
  const FRONTEND_STATIC_PATH = normalize(
    `${cwd()}/dist/apps/browser/browser/static`,
  );
  const BACKEND_HTML_PATH = normalize(`${cwd()}/../server/templates`);
  const BACKEND_STATIC_PATH = normalize(`${cwd()}/../server/static`);

  const FRONTEND_FONTS_PATH = normalize(`${cwd()}/apps/browser/public/fonts`);
  const FRONTEND_IMAGES_PATH = normalize(`${cwd()}/apps/browser/public/images`);

  const HTML_FILES = [normalize(`${FRONTEND_DIST_PATH}/index.html`)];
  const STATIC_FILES = [
    normalize(`${FRONTEND_DIST_PATH}/*.css`),
    normalize(`${FRONTEND_DIST_PATH}/*.js`),
    normalize(`${FRONTEND_DIST_PATH}/*.ico`),
  ];
  const FONT_FILES = [normalize(`${FRONTEND_FONTS_PATH}/**/*.ttf`)];

  match(existsSync(FRONTEND_STATIC_PATH))
    .with(false, () => mkdirSync(FRONTEND_STATIC_PATH))
    .otherwise(noop);

  console.log(`Copying static files to ${FRONTEND_STATIC_PATH}`);

  await copy(STATIC_FILES, FRONTEND_STATIC_PATH);

  console.log(`Copying font files to ${FRONTEND_STATIC_PATH}`);

  await copy(FONT_FILES, FRONTEND_STATIC_PATH, { flat: true });

  console.log(`Cleaning previous HTML files in ${BACKEND_HTML_PATH}`);

  await deleteAsync([normalize(`${BACKEND_HTML_PATH}/*.html`)], {
    force: true,
  });

  console.log(`Cleaning previous static files in ${BACKEND_STATIC_PATH}`);

  await deleteAsync(
    [
      normalize(`${BACKEND_STATIC_PATH}/*.js`),
      normalize(`${BACKEND_STATIC_PATH}/*.css`),
      normalize(`${BACKEND_STATIC_PATH}/*.ico`),
      normalize(`${BACKEND_STATIC_PATH}/*.ttf`),
      normalize(`${BACKEND_STATIC_PATH}/*.jpg`),
    ],
    { force: true },
  );

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

  console.log(`Updating font paths in CSS files in ${BACKEND_STATIC_PATH}`);

  await replaceInFile({
    files: `${BACKEND_STATIC_PATH.replaceAll('\\', '/')}/*.css`,
    from: /\/fonts\/[^/]+\//gu,
    to: '',
  });

  console.log(`Copying font files to ${BACKEND_STATIC_PATH}`);

  await copy(FONT_FILES, BACKEND_STATIC_PATH, { flat: true });

  console.log(
    `Scanning compiled code for jpg references in ${BACKEND_STATIC_PATH}`,
  );

  const jpgPattern = /(?<base>[a-zA-Z0-9_-]+)-(?<hash>[A-Z0-9]+)\.jpg/gu;
  const jsFiles = readdirSync(BACKEND_STATIC_PATH).filter((name) =>
    name.endsWith('.js'),
  );

  const jpgReferences = new Map(
    jsFiles.flatMap((name) => {
      const content = readFileSync(
        normalize(`${BACKEND_STATIC_PATH}/${name}`),
        'utf-8',
      );

      return [...content.matchAll(jpgPattern)].map(({ groups }) => [
        `${groups.base}.jpg`,
        `${groups.base}-${groups.hash}.jpg`,
      ]);
    }),
  );

  console.log(
    `Copying ${jpgReferences.size} jpg file(s) to ${BACKEND_STATIC_PATH}`,
  );

  for (const [sourceName, hashedName] of jpgReferences) {
    copyFileSync(
      normalize(`${FRONTEND_IMAGES_PATH}/${sourceName}`),
      normalize(`${BACKEND_STATIC_PATH}/${hashedName}`),
    );
  }

  console.log(
    `Updating media paths in compiled code files in ${BACKEND_STATIC_PATH}`,
  );

  await replaceInFile({
    files: `${BACKEND_STATIC_PATH.replaceAll('\\', '/')}/*.js`,
    from: /\.\/media\//gu,
    to: 'static/',
  });

  console.log(`Deleting static files in ${FRONTEND_DIST_PATH}`);

  await deleteAsync(STATIC_FILES);

  console.log('Done!');
}

await build();
