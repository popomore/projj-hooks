#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const runscript = require('runscript');
const { getConfig, run } = require('../lib/utils');

const cwd = process.cwd();
const config = getConfig({
  node_modules: true,
  git: true,
});

run(function* () {
  if (config.node_modules === true && fs.existsSync(path.join(cwd, 'node_modules'))) {
    const cmd = 'rm -rf node_modules';
    console.log('Run %s', cmd);
    yield runscript(cmd);
  }

  if (config.git === true && fs.existsSync(path.join(cwd, '.git'))) {
    const cmd = 'git clean -dxf';
    console.log('Run %s', cmd);
    yield runscript(cmd);
  }
});
