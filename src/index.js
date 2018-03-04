import Web3 from 'web3'

let web3

export default (Vue, options) => {

  web3 = new Web3(options.provider)

  function onNewBlockHeader(error, result) {
    console.log(error, result)
  }

  Vue.prototype.$bindCall = async function (key, { method, contract }) {
    let value = await contract[method].call()
    this[key] = value

    web3.eth.subscribe('newBlockHeaders', onNewBlockHeader)
  }

  Vue.prototype.$bindEvents = function (key, ref, options) {
  }
}
