#!/usr/bin/env node

'use strict';

const os = require('os');
const path = require('path');
const fs = require('mz/fs');
const { getConfig, run } = require('../lib/utils');

const cwd = process.cwd();
const title = path.basename(cwd);
const config = getConfig({
  setting: path.join(os.homedir(), 'Library/Application Support/Code/User/projects.json'),
});

const setting = config.setting;

run(function* () {
  let projects = [];
  if (yield fs.exists(setting)) {
    const body = yield fs.readFile(setting, 'utf8');
    projects = JSON.parse(body);
    console.log('Read %s', setting);
  }

  if (checkPath(cwd, projects)) {
    console.log('%s exist', cwd);
    return;
  }

  projects.push({
    name: title,
    rootPath: cwd,
    paths: [],
    group: '',
  });

  const body = JSON.stringify(projects, null, 2);
  yield fs.writeFile(setting, body);
  console.log('Write %s', setting);
});

function checkPath(cwd, projects) {
  for (const project of projects) {
    if (project.rootPath === cwd) return true;
  }
  return false;
}
