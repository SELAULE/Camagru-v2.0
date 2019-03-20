var sum = require('../sum');
var expect = require('chai').expect;

describe('#sum()', function() {

  context('without arguments', function() {
    it('should return 0', function(done) {
      expect(sum()).to.equal(0)
      done();
    })
  })
  
  context('with number arguments', function() {
    it('should return sum of arguments', function(done) {
      expect(sum(1, 2, 3, 4, 5)).to.equal(15)
      done();
    })
    
    it('should return argument when only one argument is passed', function(done) {
      expect(sum(5)).to.equal(5)
      done();
    })
  })
  
  context('with non-number arguments', function() {
    it('should throw error', function(done) {
      expect(function() {
        sum(1, 2, '3', [4], 5)
      }).to.throw(TypeError, 'sum() expects only numbers.')
      done();
    })
  })
  
})