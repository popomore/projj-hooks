#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('mz/fs');
const runscript = require('runscript');
const { getConfig, run } = require('../lib/utils');

const configDir = path.join(process.env.HOME, '.projj');
const configPath = path.join(configDir, 'config.json');

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

  const domain = yield getDomain(cwd);
  if (config[domain]) {
    const { name, email, signingkey } = config[domain];
    console.log('%s includes %s', cwd, domain);
    console.log('set name: %s, email: %s, signingkey: %s', name, email, signingkey || '');
    yield runscript(`git config --replace-all user.name ${name}`, { cwd });
    yield runscript(`git config --replace-all user.email ${email}`, { cwd });
    if (signingkey) {
      yield runscript('git config commit.gpgsign true', { cwd });
      yield runscript(`git config --replace-all user.signingkey ${signingkey}`, { cwd });
    }
  }
});

function* getDomain(cwd) {
  const configExists = yield fs.exists(configPath);
  if (configExists) {
    const originalConfig = JSON.parse(yield fs.readFile(configPath, 'utf8'));
    const mergedConfig = resolveConfig(originalConfig);
    const base = Array.isArray(mergedConfig.base) ? mergedConfig.base : [ mergedConfig.base ];
    const domainList = base.map(base => {
      const [ domain ] = cwd.replace(`${base}/`, '').split('/');
      return domain;
    });
    const domain = domainList.find(base => config[base]);
    return domain;
  }
}


function resolveConfig(config) {
  const defaults = {
    base: `${process.env.HOME}/projj`,
    hooks: {},
    alias: {
      'github://': 'https://github.com/',
    },
  };
  config = Object.assign({}, defaults, config);
  if (!Array.isArray(config.base)) {
    config.base = [ config.base ];
  }
  config.base = config.base.map(baseDir => {
    switch (baseDir[0]) {
      case '.':
        return path.join(path.dirname(configPath), baseDir);
      case '~':
        return baseDir.replace('~', process.env.HOME);
      case '/':
        return baseDir;
      default:
        return path.join(process.cwd(), baseDir);
    }
  });
  return config;
}
