#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('../lib/utils');

const cwd = process.cwd();
const gitConfig = path.join(cwd, '.git/config');
const config = utils.getConfig({
  'github.com': {
    name: '',
    email: '',
  },
});

if (!fs.existsSync(gitConfig)) {
  console.log('%s don\'t exist', gitConfig);
  return;
}

const domain = getDomain(cwd);
if (config[domain]) {
  const { name, email } = config[domain];
  console.log('%s includes %s', cwd, domain);
  console.log('set name: %s, email: %s', name, email);
  fs.appendFileSync(gitConfig, `[user]\n  name = ${name}\n  email = ${email}\n`);
}

function getDomain(cwd) {
  const m = cwd.match(/([^/]*)\/[^/]*\/[^/]*$/);
  if (m) {
    return m[1];
  }
}
