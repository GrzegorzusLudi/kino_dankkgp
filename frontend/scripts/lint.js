/* eslint-disable @typescript-eslint/no-require-imports */

const { exec } = require('node:child_process');
const { print } = require('./print');
const packageJson = require('./../package.json');

async function lint() {
  const eslintVersion = packageJson.devDependencies.eslint;

  const command = `npx eslint@${eslintVersion} --fix`;

  exec(command, (error, stdout, stderr) => print(error, stdout, stderr, true));
}

lint();
