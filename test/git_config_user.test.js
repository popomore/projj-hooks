'use strict';

const path = require('path');
const coffee = require('coffee');
const mm = require('mm');
const rimraf = require('mz-modules/rimraf');
const runscript = require('runscript');
const assert = require('assert');

const binfile = path.join(__dirname, '../node_modules/.bin/projj');
const fixtures = path.join(__dirname, 'fixtures');
const tmp = path.join(fixtures, 'tmp');


describe('test/git_config_user.test.js', () => {

  let cwd;
  beforeEach(() => {
    mm(process.env, 'PATH', `${fixtures}/bin:${process.env.PATH}`);
  });
  afterEach(mm.restore);
  afterEach(() => rimraf(tmp));
  afterEach(() => rimraf(path.join(cwd, '.git')));

  it('should return when no .git', function* () {
    cwd = path.join(fixtures, 'nogit');
    const home = path.join(fixtures, 'hook');
    mm(process.env, 'HOME', home);

    yield coffee.fork(binfile, [ 'run', 'git_config_user' ], { cwd })
    // .debug()
    .expect('stdout', new RegExp(`${cwd}/.git/config don't exist`))
    .expect('code', 0)
    .end();
  });

  it('should add config when github', function* () {
    cwd = path.join(fixtures, 'github.com/popomore/test');
    const home = path.join(fixtures, 'hook');
    mm(process.env, 'HOME', home);

    yield runscript('git init', { cwd });

    yield coffee.fork(binfile, [ 'run', 'git_config_user' ], { cwd })
    // .debug()
    .expect('stdout', new RegExp(`${cwd} includes github.com`))
    .expect('stdout', /set name: github, email: x@github.com/)
    .expect('code', 0)
    .end();

    const { stdout } = yield runscript('git config --get-regexp user', { cwd, stdio: 'pipe' });
    assert(stdout.toString() === 'user.name github\nuser.email x@github.com\n');
  });

  it('should add config when gitlab', function* () {
    cwd = path.join(fixtures, 'gitlab.com/popomore/test');
    const home = path.join(fixtures, 'hook');
    mm(process.env, 'HOME', home);

    yield runscript('git init', { cwd });

    yield coffee.fork(binfile, [ 'run', 'git_config_user' ], { cwd })
    // .debug()
    .expect('stdout', new RegExp(`${cwd} includes gitlab.com`))
    .expect('stdout', /set name: gitlab, email: x@gitlab.com/)
    .expect('code', 0)
    .end();

    const { stdout } = yield runscript('git config --get-regexp user', { cwd, stdio: 'pipe' });
    assert(stdout.toString() === 'user.name gitlab\nuser.email x@gitlab.com\n');
  });
});
