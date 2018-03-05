const Web3 = require('web3')
const _ = require('lodash')

module.exports = (Vue, options) => {

  let web3 = options.web3 || new Web3(options.provider)
  let callsToCheck = []

  web3.eth
    .subscribe('newBlockHeaders', err => err && console.error(err))
    .on('data', onNewBlockHeaderData)

  async function onNewBlockHeaderData(blockHeader) {
    if (! blockHeader.number) return

    let block = await web3.eth.getBlock(blockHeader.number, true)
    
    let addressesToCheck = callsToCheck.map(call => call.contract.options.address)

    let relevant = block.transactions.filter(txn => {
      return addressesToCheck.includes(txn.to)
    })

    let addressesToCall = relevant.map(txn => txn.to)

    let callsToMake = callsToCheck.filter(call => addressesToCall.includes(call.contract.options.address))

    callsToMake.forEach(call => bindCall(call.vm, call.key, call))
  }

  async function bindCall(vm, key, { method, contract, args }) {
    let call = contract.methods[method].apply(contract.methods, args)
    let value = await call.call()
    vm[key] = value
    vm.$emit('CALL_SYNCED', { key, method, args, value })
  }

  Vue.prototype.$bindCall = async function (key, { method, contract, args }) {
    callsToCheck.push({
      vm: this,
      key,
      method,
      contract,
      args
    })

    await bindCall(this, key, { method, contract, args })
  }

  Vue.prototype.$bindEvents = async function (key, { event, contract, options }) {
    options = Object.assign({}, { fromBlock: 0, toBlock: 'latest' }, options)
    
    contract.events[event](options, (err, e) => {
      if (err) throw err

      this[key].push(e)
      this.$emit('EVENT_SYNCED', e)
    })
  }

  Vue.mixin({
    created() {
      var bindings = this.$options.web3
      if (typeof bindings === 'function') bindings = bindings.call(this)
      if (! bindings) return
      
      let calls = _.pickBy(bindings, value => value.method)
      Object.keys(calls).forEach(key => this.$bindCall(key, calls[key]))

      let events = _.pickBy(bindings, value => value.event)
      Object.keys(events).forEach(key => this.$bindEvents(key, events[key]))
    }
  })
}
