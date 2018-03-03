import Web3 from 'web3'

let web3

export default (Vue, options) => {

  web3 = new Web3(options.provider)

  Vue.prototype.$bindCall = function ({ method, abi, address }) {
    console.log('binding!')
  }

  Vue.prototype.$bindEvents = function (key, ref, options) {
  }
}
