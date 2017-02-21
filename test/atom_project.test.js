'use strict';

const assert = require('assert');
const path = require('path');
const coffee = require('coffee');
const mm = require('mm');
const rimraf = require('mz-modules/rimraf');
const fs = require('mz/fs');
const utils = require('../lib/utils');

const binfile = path.join(__dirname, '../node_modules/.bin/projj');
const fixtures = path.join(__dirname, 'fixtures');
const tmp = path.join(fixtures, 'tmp');


describe('test/atom_project.test.js', () => {

  let cwd;
  beforeEach(() => {
    mm(process.env, 'PATH', `${fixtures}/bin:${process.env.PATH}`);
  });
  afterEach(mm.restore);
  afterEach(() => rimraf(tmp));
  afterEach(() => rimraf(path.join(cwd, 'projects.cson')));

  it('should generate when no setting', function* () {
    cwd = path.join(fixtures, 'project');
    const home = path.join(fixtures, 'hook');
    mm(process.env, 'HOME', home);

    yield coffee.fork(binfile, [ 'run', 'atom_project' ], { cwd })
    // .debug()
    .notExpect('stdout', /Read projects.cson/)
    .expect('stdout', /Write projects.cson/)
    .expect('code', 0)
    .end();

    const body = yield fs.readFile(path.join(cwd, 'projects.cson'), 'utf8');
    const arr = yield utils.parseCson(body);
    assert(arr.length === 1);
    assert(arr[0].title === 'project');
    assert(arr[0].paths[0] === cwd);
  });

  it('should generate when setting exist', function* () {
    cwd = path.join(fixtures, 'project');
    const home = path.join(fixtures, 'hook');
    mm(process.env, 'HOME', home);

    const str = yield utils.stringifyCson([{
      title: 'project',
      paths: [ cwd ],
    }]);
    yield fs.writeFile(path.join(cwd, 'projects.cson'), str);

    yield coffee.fork(binfile, [ 'run', 'atom_project' ], { cwd })
    // .debug()
    .expect('stdout', /Read projects.cson/)
    .expect('stdout', new RegExp(`${cwd} exist`))
    .expect('code', 0)
    .end();
  });
});
