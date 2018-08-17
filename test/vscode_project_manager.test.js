'use strict';

const assert = require('assert');
const path = require('path');
const coffee = require('coffee');
const mm = require('mm');
const rimraf = require('mz-modules/rimraf');
const fs = require('mz/fs');

const binfile = path.join(__dirname, '../node_modules/.bin/projj');
const fixtures = path.join(__dirname, 'fixtures');
const tmp = path.join(fixtures, 'tmp');


describe('test/vscode_project_manager.test.js', () => {

  let cwd;
  beforeEach(() => {
    mm(process.env, 'PATH', `${fixtures}/bin:${process.env.PATH}`);
  });
  afterEach(mm.restore);
  afterEach(() => rimraf(tmp));
  afterEach(() => rimraf(path.join(cwd, 'projects.json')));

  it('should generate when no setting', function* () {
    cwd = path.join(fixtures, 'project');
    const home = path.join(fixtures, 'hook');
    mm(process.env, 'HOME', home);

    yield coffee.fork(binfile, [ 'run', 'vscode_project_manager' ], { cwd })
    // .debug()
    .notExpect('stdout', /Read projects.json/)
    .expect('stdout', /Write projects.json/)
    .expect('code', 0)
    .end();

    const body = yield fs.readFile(path.join(cwd, 'projects.json'), 'utf8');
    const arr = JSON.parse(body);
    assert(arr.length === 1);
    assert(arr[0].name === 'project');
    assert(arr[0].rootPath === cwd);
  });

  it('should generate when setting exist', function* () {
    cwd = path.join(fixtures, 'project');
    const home = path.join(fixtures, 'hook');
    mm(process.env, 'HOME', home);

    const str = JSON.stringify([{ name: 'project', rootPath: cwd }]);
    yield fs.writeFile(path.join(cwd, 'projects.json'), str);

    yield coffee.fork(binfile, [ 'run', 'vscode_project_manager' ], { cwd })
    // .debug()
    .expect('stdout', /Read projects.json/)
    .expect('stdout', new RegExp(`${cwd} exist`))
    .expect('code', 0)
    .end();
  });
});
