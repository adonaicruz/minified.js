// tests for minified-util-src.js
//
// Instructions:
// - requires node.js installation
// - install mocha (npm mocha -g)
// - run (mocha minified-util-prop-test.js)
//

var testCommon = require("./minified-util-common.js");
var assert = require("assert");

var AMD_NAME = testCommon.AMD_NAME;
var loadInContextSrc = testCommon.loadInContextSrc;


function runTests(loadInContext) {
	function req() {
		return loadInContext().require(AMD_NAME)._;
	}
	
	describe('prop()', function() {
		it('can read simple properties', function() {
			var _ = req();
			var obj = {a: 2, b: "tst"};
			assert.equal(_.prop('a', obj), 2);
			assert.equal(_.prop('b', obj), "tst");
		});
		it('can write simple properties', function() {
			var _ = req();
			var obj = {a: 2, b: "tst"};
			assert.equal(_.prop('a', obj, 2), 2);
			assert.equal(_.prop('b', obj, "tst"), "tst");
			assert.equal(obj.a, 2);
			assert.equal(obj.b, "tst");
		});
		it('can read function properties', function() {
			var _ = req();
			var obj = {a: function() {return 2;}, b: function() { return "tst"; }};
			assert.equal(_.prop('a', obj), 2);
			assert.equal(_.prop('b', obj), "tst");
		});
		it('can write function properties', function() {
			var _ = req();
			var obj0 = {a: 2, b: "tst"};
			var obj = {a: function(v) { return obj0.a = v;}, b: function(v) { return obj0.b = v;}};
			assert.equal(_.prop('a', obj, 2), 2);
			assert.equal(_.prop('b', obj, "tst"), "tst");
			assert.equal(obj0.a, 2);
			assert.equal(obj0.b, "tst");
		});
		
		it('can read nested properties', function() {
			var _ = req();
			var obj = {a: {u:{x:2}}, b: ["00", "tst"], c: function() { return {g: 3}; }, d: function() {return [1, 2, 3, 4];}};
			assert.equal(_.prop('a.u.x', obj), 2);
			assert.equal(_.prop('b.1', obj), "tst");
			assert.equal(_.prop('c.g', obj), 3);
			assert.equal(_.prop('d.3', obj), 4);
		});
		it('can read write properties', function() {
			var _ = req();
			var obj0 = {c: {g: 3}, d: [1, 2, 3, 4]};
			var obj  = {a: {u:{x:2}}, b: ["00", "tst"], c: function(v) { if (v) obj0.c = v; return obj0.c; }, d: function(v) {if (v) obj0.d = v; return obj0.d;}};
			assert.equal(_.prop('a.u.x', obj, 7), 7);
			assert.equal(_.prop('b.1', obj, "txt"), "txt");
			assert.equal(_.prop('c.g', obj, 111), 111);
			assert.equal(_.prop('d.2', obj, 9), 9);
			
			assert.equal(_.prop('a.u.x', obj), 7);
			assert.equal(_.prop('b.1', obj), "txt");
			assert.equal(_.prop('c.g', obj), 111);
			assert.equal(_.prop('d.2', obj), 9);
		});

	});}

testCommon.run(runTests);



