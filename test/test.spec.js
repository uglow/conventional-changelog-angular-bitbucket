'use strict';

let conventionalChangelogCore = require('conventional-changelog-core');
let preset = require('../');
let expect = require('chai').expect;
let gitDummyCommit = require('git-dummy-commit');
let shell = require('shelljs');
let through = require('through2');
let betterThanBefore = require('better-than-before')();
let preparing = betterThanBefore.preparing;

betterThanBefore.setups([
  function() {
    shell.config.silent = true;
    shell.rm('-rf', 'tmp');
    shell.mkdir('tmp');
    shell.cd('tmp');
    shell.mkdir('git-templates');
    shell.exec('git init --template=./git-templates');

    gitDummyCommit('chore: first commit');
    gitDummyCommit(['feat: amazing new module', 'BREAKING CHANGE: Not backward compatible.']);
    gitDummyCommit(['fix(compile): avoid a bug', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['perf(ngOptions): make it faster', ' closes #1, #2']);
    gitDummyCommit('revert(ngOptions): bad commit');
    gitDummyCommit('fix(*): oops');
  },
  function() {
    gitDummyCommit(['feat(awesome): addresses the issue brought up in #133']);
  },
  function() {
    gitDummyCommit(['feat(awesome): fix #88']);
  },
  function() {
    gitDummyCommit(['feat(awesome): issue brought up by @bcoe! on Friday']);
  },
  function() {
    gitDummyCommit(['docs(readme): make it clear', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['style(whitespace): make it easier to read', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['refactor(code): change a lot of code', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['test(*): more tests', 'BREAKING CHANGE: The Change is huge.']);
    gitDummyCommit(['chore(deps): bump', 'BREAKING CHANGE: The Change is huge.']);
  },
  function() {
    gitDummyCommit(['feat(deps): bump', 'BREAKING CHANGES: Also works :)']);
  },
  function() {
    shell.exec('git tag v1.0.0');
    gitDummyCommit('feat: some more features');
  },
]);

describe('angular preset', function() {
  it('should work if there is no semver tag', function(done) {
    preparing(1);

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: __dirname + '/fixtures/bitbucket-host.json',
      },
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('amazing new module');
        expect(chunk).to.include('**compile:** avoid a bug');
        expect(chunk).to.include('make it faster');
        expect(chunk).to.include(', closes #1, #2');      // Links are not created
        expect(chunk).to.include('Not backward compatible.');
        expect(chunk).to.include('**compile:** The Change is huge.');
        expect(chunk).to.include('Features');
        expect(chunk).to.include('Bug Fixes');
        expect(chunk).to.include('Performance Improvements');
        expect(chunk).to.include('Reverts');
        expect(chunk).to.include('bad commit');
        expect(chunk).to.include('BREAKING CHANGES');

        expect(chunk).to.not.include('first commit');
        expect(chunk).to.not.include('feat');
        expect(chunk).to.not.include('fix');
        expect(chunk).to.not.include('perf');
        expect(chunk).to.not.include('revert');
        expect(chunk).to.not.include('***:**');
        expect(chunk).to.not.include(': Not backward compatible.');

        expect(chunk).to.match(/oops \(\[[0-9a-z]{7}\]\(http:\/\/any.bbucket.host:7999\/proj\/repo-name\/commits\/[0-9a-z]{7}\)\)/);      // commit hash is linked

        done();
      }));
  });

  it('should NOT generate issue links because we don\'t know the issue tracker URL on BitBucket', function(done) {
    preparing(2);

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: __dirname + '/fixtures/bitbucket-host.json',
      },
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();
        expect(chunk).to.include('in #133');
        done();
      }));
  });

  it('should not generate issue refs in the footer when they appear in the subject', function(done) {
    preparing(3);

    conventionalChangelogCore({
      config: preset,
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();
        expect(chunk).to.include(' fix #88');
        expect(chunk).to.not.include('closes [#88](');
        done();
      }));
  });

  it('should NOT replace @username with GitHub user URL as feature is not available on BitBucket', function(done) {
    preparing(4);

    conventionalChangelogCore({
      config: preset,
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();
        expect(chunk).to.include('issue brought up by @bcoe! on Friday');
        done();
      }));
  });

  it('should not discard commit if there is BREAKING CHANGE', function(done) {
    preparing(5);

    conventionalChangelogCore({
      config: preset,
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('Documentation');
        expect(chunk).to.include('Styles');
        expect(chunk).to.include('Code Refactoring');
        expect(chunk).to.include('Tests');
        expect(chunk).to.include('Chores');

        done();
      }));
  });

  it('should render BREAKING CHANGES the same as BREAKING CHANGE', function(done) {
    preparing(6);

    conventionalChangelogCore({
      config: preset,
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk) {
        chunk = chunk.toString();

        expect(chunk).to.include('BREAKING CHANGES');
        expect(chunk).to.include('Also works :)');

        done();
      }));
  });

  it('should work if there is a semver tag', function(done) {
    preparing(7);
    let i = 0;

    conventionalChangelogCore({
      config: preset,
      outputUnreleased: true,
      pkg: {
        path: __dirname + '/fixtures/bitbucket-host.json',
      },
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.include('some more features');
        expect(chunk).to.not.include('BREAKING');

        expect(chunk).to.include('http://any.bbucket.host:7999/proj/repo-name/compare/' +
          'v2.0.0%0Dv1.0.0#diff');

        i++;
        cb();
      }, function() {
        expect(i).to.equal(1);
        done();
      }));
  });

  it('should work with unknown host', function(done) {
    preparing(7);
    let i = 0;

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: __dirname + '/fixtures/_unknown-host.json',
      },
    })
      .on('error', function(err) {
        done(err);
      })
      .pipe(through(function(chunk, enc, cb) {
        chunk = chunk.toString();

        expect(chunk).to.include('(http://unknown/compare');
        expect(chunk).to.match(/some more features \(.*\)/);      // No commit hash!

        i++;
        cb();
      }, function() {
        expect(i).to.equal(1);
        done();
      }));
  });

  it('should support directly utilizing http/https repository urls', function(done) {
    preparing(8);
    let i = 0;

    conventionalChangelogCore({
      config: preset,
      pkg: {
        path: __dirname + '/fixtures/bitbucket-http-host.json',
      },
    }).on('error', done).pipe(through(function(chunk, enc, cb) {
      chunk = chunk.toString();

      expect(chunk).to.include('https://bitbucket.example.com/EX/example-repo/compare/');
      expect(chunk).to.include('https://bitbucket.example.com/EX/example-repo/commits/');
      expect(chunk).to.match(/some more features \(.*\)/);

      i++;
      cb();
    }, function() {
      expect(i).to.equal(1);
      done();
    }));
  });
});
