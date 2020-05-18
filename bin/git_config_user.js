#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('mz/fs');
const runscript = require('runscript');
const { getConfig, run } = require('../lib/utils');

const cwd = process.cwd();
const gitConfig = path.join(cwd, '.git/config');
const config = getConfig({
  'github.com': {
    name: '',
    email: '',
    signingkey: '',
  },
});

run(function* () {
  const exists = yield fs.exists(gitConfig);
  if (!exists) {
    console.log('%s don\'t exist', gitConfig);
    return;
  }

  const domain = getDomain(cwd);
  if (config[domain]) {
    const { name, email, signingkey } = config[domain];
    console.log('%s includes %s', cwd, domain);
    console.log('set name: %s, email: %s, signingkey: %s', name, email, signingkey || '');
    yield runscript(`git config --replace-all user.name ${name}`, { cwd });
    yield runscript(`git config --replace-all user.email ${email}`, { cwd });
    if (signingkey) {
      yield runscript(`git config commit.gpgsign true`, { cwd });
      yield runscript(`git config --replace-all user.signingkey ${signingkey}`, { cwd });
    }
  }
});

function getDomain(cwd) {
  const m = cwd.match(/([^/]*)\/[^/]*\/[^/]*$/);
  if (m) {
    return m[1];
  }
}
