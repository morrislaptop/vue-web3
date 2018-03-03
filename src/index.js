import Web3 from 'web3'

let web3

export default (Vue, options) => {

  web3 = new Web3(options.provider)

  Vue.prototype.$bindCall = async function (key, { method, contract }) {
    let value = await contract[method].call()
    this[key] = value
  }

  Vue.prototype.$bindEvents = function (key, ref, options) {
  }
}
