'use strict';

var grunt = require('grunt'),
    os = require('os');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.kmc = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    tearDown: function(done){
        grunt.file.delete('test/assets/index.combo.js');
        done();
    },
    index: function (test) {
        test.expect(1);

        var actual = grunt.file.read('test/assets/index.combo.js', 'utf-8');
        var expected = grunt.file.read('test/expected/index.combo.js', 'utf-8').replace("\r\n", os.EOL);
        test.equal(actual, expected, 'should build proper combo file.');

        test.done();
    }
};
