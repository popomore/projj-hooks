'use strict';

const fs = require('mz/fs');
const path = require('path');
const coffee = require('coffee');
const mm = require('mm');
const rimraf = require('mz-modules/rimraf');
const mkdirp = require('mz-modules/mkdirp');
const runscript = require('runscript');

const binfile = path.join(__dirname, '../node_modules/.bin/projj');
const fixtures = path.join(__dirname, 'fixtures');
const tmp = path.join(fixtures, 'tmp');
const home = path.join(fixtures, 'hook');


describe('test/dirty.test.js', () => {

  beforeEach(() => {
    mm(process.env, 'HOME', home);
    mm(process.env, 'PATH', `${fixtures}/bin:${process.env.PATH}`);
  });
  beforeEach(() => mkdirp(tmp));
  afterEach(mm.restore);
  afterEach(() => rimraf(tmp));

  it('should not show dirty', function* () {
    yield runscript('git init', { cwd: tmp });

    yield coffee.fork(binfile, [ 'run', 'dirty' ], { cwd: tmp })
      // .debug()
      .notExpect('stdout', /it's dirty/)
      .expect('code', 0)
      .end();
  });

  it('should show dirty', function* () {
    yield runscript('git init', { cwd: tmp });
    yield fs.writeFile(path.join(tmp, 'package.json'), '{}');
    yield runscript('git add .', { cwd: tmp });
    yield runscript('git commit -m "init"', { cwd: tmp });
    yield fs.writeFile(path.join(tmp, 'package.json'), '{"name":""}');

    yield coffee.fork(binfile, [ 'run', 'dirty' ], { cwd: tmp })
      // .debug()
      .expect('stdout', /it's dirty/)
      .expect('code', 0)
      .end();
  });
});
