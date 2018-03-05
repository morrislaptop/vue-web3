# VueWeb3 [![Build Status](https://img.shields.io/circleci/project/morrislaptop/vue-web3.svg)](https://circleci.com/gh/morrislaptop/vue-web3) [![npm package](https://img.shields.io/npm/v/vue-web3.svg)](https://www.npmjs.com/package/vue-web3)

> Vue.js bindings for Web3 1.0

## Installation

In module environments, e.g CommonJS:

  ``` bash
  npm install vue web3@beta vue-web3
  ```

  ``` js
  var Vue = require('vue')
  var VueWeb3 = require('vue-web3')

  // explicit installation required in module environments
  Vue.use(VueWeb3, { provider: web3.currentProvider })
  ```

## Usage

``` js
let myContract = new web3.eth.Contract(MyContract, '0xbA911C4A817e69998Ffd3626d3c5366038e8480F')

var vm = new Vue({
  el: '#demo',
  web3: {
    // can bind to calls
    lastUpdated: {
      contract: myContract,
      method: 'getLastUpdated',
      arguments: []
    },
    // can also bind to events
    transfers: {
      contract: myContract,
      event: 'OwnershipTransferred',
      options: {
        fromBlock: 2
      }
    }
  }
})
```

If you need to access properties from the Vue instance, use the function syntax:

```js
var vm = new Vue({
  el: '#demo',
  web3: function () {
    return {
      lastUpdated: {
        contract: myContract,
        method: 'getLastUpdated',
        arguments: [this.$store.state.user.uid]
      }
    }
  }
})
```

⚠️: This function will get executed only once. If you want to have automatic rebind (pretty much like a computed property) use a `$watch` and call `$unbind` and then `$bindCall` or `$bindEvents`

``` html
<div id="demo">
  <pre>{{ lastUpdated }}</pre>
  <ul>
    <li v-for="transfer in transfers">From {{ transfer.previousOwner }} to {{ transfer.newOwner }}</li>
  </ul>
</div>
```

The above will bind the Vue instance's `lastUpdated` and `transfers` to the respective Web3 data sources.

Alternatively, you can also manually bind to Web3 with the `$bindCall` or `$bindEvents` instance methods:

``` js
let myContract = new web3.eth.Contract(MyContract, '0xbA911C4A817e69998Ffd3626d3c5366038e8480F')
vm.$bindCall('user', { contract: myContract, method: 'getUser' })
vm.$bindEvents('transfers', { contract: myContract, event: 'OwnershipTransferred' })

// References are unbound when the component is destroyed but you can manually unbind a reference
// if needed
vm.$unbind('items')
```

## Contributing

Clone the repo, then:

```bash
$ npm install    # install dependencies
$ npm test       # run test suite with coverage report
$ npm run dev    # watch and build dist/vue-web3.js
$ npm run build  # build dist/vue-web3.js and vue-web3.min.js
```

## License

[MIT](http://opensource.org/licenses/MIT)
