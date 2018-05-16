#!/usr/bin/env node

'use strict';

const runscript = require('runscript');
const { run } = require('../lib/utils');

run(function* () {
  const cmd = 'git diff --quiet --ignore-submodules';

  try {
    yield runscript(cmd);
  } catch (err) {
    console.info('it\'s dirty');
  }
});
