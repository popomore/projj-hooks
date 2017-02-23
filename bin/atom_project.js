#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('mz/fs');
const { getConfig, run, stringifyCson, parseCson } = require('../lib/utils');

const cwd = process.cwd();
const title = path.basename(cwd);
const config = getConfig({
  setting: 'projects.cson',
});

const setting = config.setting;

run(function* () {
  let projects = [];
  if (yield fs.exists(setting)) {
    const body = yield fs.readFile(setting, 'utf8');
    projects = yield parseCson(body);
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

  const body = yield stringifyCson(projects);
  yield fs.writeFile(setting, body);
  console.log('Write %s', setting);
});

function checkPath(cwd, projects) {
  for (const project of projects) {
    if (project.paths && project.paths.includes(cwd)) return true;
  }
  return false;
}
