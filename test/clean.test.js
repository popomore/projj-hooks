'use strict';

const fs = require('fs');
const path = require('path');
const coffee = require('coffee');
const mm = require('mm');
const rimraf = require('mz-modules/rimraf');
const runscript = require('runscript');
const assert = require('assert');

const binfile = path.join(__dirname, '../node_modules/.bin/projj');
const fixtures = path.join(__dirname, 'fixtures');
const tmp = path.join(fixtures, 'tmp');


describe('test/clean.test.js', () => {

  beforeEach(() => {
    mm(process.env, 'PATH', `${fixtures}/bin:${process.env.PATH}`);
  });
  afterEach(mm.restore);
  afterEach(() => rimraf(tmp));

  describe('node_modules', () => {
    const cwd = path.join(fixtures, 'clean-node-modules');
    const home = path.join(fixtures, 'hook');
    beforeEach(() => {
      mm(process.env, 'HOME', home);
      return runscript('npm install', { cwd });
    });
    afterEach(() => rimraf(path.join(cwd, 'node_modules')));

    it('should clean node_modules', function* () {
      assert(fs.existsSync(path.join(cwd, 'node_modules')));

      yield coffee.fork(binfile, [ 'run', 'clean' ], { cwd })
      // .debug()
      .expect('stdout', /Run rm -rf node_modules/)
      .expect('code', 0)
      .end();

      assert(!fs.existsSync(path.join(cwd, 'node_modules')));
    });

    it('should not clean node_modules when disabled', function* () {
      assert(fs.existsSync(path.join(cwd, 'node_modules')));

      yield coffee.fork(binfile, [ 'run', 'clean_disable_node_modules' ], { cwd })
      // .debug()
      .notExpect('stdout', /Run rm -rf node_modules/)
      .expect('code', 0)
      .end();

      assert(fs.existsSync(path.join(cwd, 'node_modules')));
    });

    it('should not clean when node_modules don\'t exist', function* () {
      yield runscript('rm -rf node_modules', { cwd });
      assert(!fs.existsSync(path.join(cwd, 'node_modules')));

      yield coffee.fork(binfile, [ 'run', 'clean' ], { cwd })
      // .debug()
      .notExpect('stdout', /Run rm -rf node_modules/)
      .expect('code', 0)
      .end();
    });
  });

});
