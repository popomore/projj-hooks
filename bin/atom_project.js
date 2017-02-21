#!/usr/bin/env node

'use strict';

const path = require('path');
const co = require('co');
const fs = require('mz/fs');
const utils = require('../lib/utils');

const cwd = process.cwd();
const title = path.basename(cwd);
const config = utils.getConfig({
  setting: 'projects.cson',
});

const setting = config.setting;

co(function* () {
  let projects = [];
  if (yield fs.exists(setting)) {
    const body = yield fs.readFile(setting, 'utf8');
    projects = yield utils.parseCson(body);
    console.log('Read %s', setting);
  }

  if (checkPath(cwd, projects)) {
    console.log('%s exist', cwd);
    return;
  }

  projects.push({
    title,
    paths: [ cwd ],
  });

  const body = yield utils.stringifyCson(projects);
  yield fs.writeFile(setting, body);
  console.log('Write %s', setting);
}).catch(err => {
  console.log(err);
});

function checkPath(cwd, projects) {
  for (const project of projects) {
    if (project.paths && project.paths.includes(cwd)) return true;
  }
  return false;
}
