# little-store

> Super simple curried storage in a given plain object when you just must have mutable state

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]
![no sudden unpublish][https://img.shields.io/badge/no%20sudden-unpublish%20%E2%9A%93-ff69b4.svg]

## Install and use

```sh
npm install --save little-store
```

```js
const littleStore = require('little-store')
const o = {}
const setFoo = littleStore(o, 'foo')
setFoo(o, 42) // returns 42
// o is {foo: 42}
```

## Why?

Mostly this is a convenient curried function for storing side data in promise chains. 
With most functions only taking and passing a single argument, storing intermediate values is 
a pain (see [my blog post][pass]). Functional libraries like Ramda and Lodash have nice 
utilities for *getting a property* from a given object, like 
[_.property](https://lodash.com/docs#property), but I could not find a simple *set property*
function. Ramda has lenses, but those return a new object (which is nice) and this is not what
I needed. Thus I was forced to do something like this - make a closure just to keep data from
the first call

```js
function login () {
    return getUsername()
        .then(function (username) {
            return getPassword()
                .then(function (password) {
                    // check username and password
                })
        })
}
```

We can store the intermediate results from each promise in local mutable object

```js
function login () {
    const state = {}
    return getUsername()
        .then((s) => {state.username = s})
        .then(getPassword)
        .then((s) => {state.password = s})
        .then(function () {
            // check username and password from state
        })
}
```

A lot more steps but smaller pyramid of promise doom.

With generators, this is a lot less code, but not as simple to start in most cases

```js
function * checkPassword () {
    const username = yield getUsername()
    const password = yield getPassword()
    // check username and password
}
```

With `little-store` creating little "set" callbacks is simple (even multiple ones)

```js
const store = require('little-store')
function login () {
    const state = {}
    return getUsername()
        .then(store(state, 'username'))
        .then(getPassword)
        .then(store(state, 'password'))
        .then(function () {
            // check username and password from state
        })
}
```

We can even avoid `store(state, ...)` boilerplate since the `littleStore` is curried

```js
const store = require('little-store')
function login () {
    const state = {}
    const remember = store(state)
    return getUsername()
        .then(remember('username'))
        .then(getPassword)
        .then(remember('password'))
        .then(function () {
            // check username and password from state
        })
}
```

[pass]: https://glebbahmutov.com/blog/passing-more-than-single-value-through-promise-chain/

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2016


* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)


License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/little-store/issues) on Github

## MIT License

Copyright (c) 2016 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/little-store.png?downloads=true
[npm-url]: https://npmjs.org/package/little-store
[ci-image]: https://travis-ci.org/bahmutov/little-store.png?branch=master
[ci-url]: https://travis-ci.org/bahmutov/little-store
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
