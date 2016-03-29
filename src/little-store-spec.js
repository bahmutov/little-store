const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('little store', () => {
  const littleStore = require('little-store')

  it('is a function', () => {
    la(is.fn(littleStore))
  })

  it('puts value in object', () => {
    const o = {}
    littleStore(o, 'foo', 42)
    la(o.foo === 42, o)
  })

  it('returns the input value', () => {
    const o = {}
    const result = littleStore(o, 'foo', 42)
    la(result === 42, result, o)
  })

  it('is curried', () => {
    const o = {}
    littleStore(o)('foo')(42)
    la(o.foo === 42, o)
  })

  it('can make a setter', () => {
    const o = {}
    const setFoo = littleStore(o, 'foo')
    la(is.fn(setFoo))
    setFoo(42)
    la(o.foo === 42, o)
  })

  it('can make multiple setters', () => {
    const o = {}
    const set = littleStore(o)
    const setFoo = set('foo')
    const setBar = set('bar')
    la(is.fn(setFoo))
    la(is.fn(setBar))
    setFoo(42)
    setBar(-1)
    la(o.foo === 42, o)
    la(o.bar === -1, o)
  })

  it('can make multiple setters on the fly', () => {
    const o = {}
    const set = littleStore(o)
    set('foo')(42)
    set('bar')(-1)
    la(o.foo === 42, o)
    la(o.bar === -1, o)
  })

  it('work with this', function () {
    const setFoo = littleStore(this, 'foo')
    la(is.fn(setFoo))
    setFoo(42)
    la(this.foo === 42, this.foo)
  })

  it('works with promises', () => {
    const o = {}
    const setFoo = littleStore(o, 'foo')
    return new Promise((resolve) => {
      setTimeout(() => resolve(42), 10)
    }).then(setFoo)
      .then(littleStore(o, 'bar'))
      .then(() => {
        la(o.foo === 42, 'foo', o)
        la(o.bar === 42, 'bar', o)
      })
  })
})
