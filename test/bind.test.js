const Vue = require('vue')
const VueWeb3 = require('../src')
const ganache = require('ganache-cli')
const Promise = require('bluebird')
const Web3 = require('web3')
const path = require('path')
const chai = require('chai')
const chaiBigNumber = require('chai-bignumber')
const SetsAndEvents = artifacts.require('./SetsAndEvents.sol')

const expect = chai.expect

// Fix this.provider.sendAsync is not a function for ganache-cli beta
web3.currentProvider.sendAsync = web3.currentProvider.sendAsync || function () {
  return web3.currentProvider.send.apply(web3.currentProvider, arguments)
}

// Use 1.x of Web3 instead of 0.x injected by Truffle
let _web3 = new Web3(web3.currentProvider)

Vue.config.productionTip = false
Vue.use(VueWeb3, { web3: _web3 })
chai.use(chaiBigNumber())

contract('Bind', accounts => {
  
  let vm, setsAndEvents

  before(async () => {
    _web3.eth.defaultAccount = accounts[0]
    let id = await _web3.eth.net.getId()
    setsAndEvents = new _web3.eth.Contract(SetsAndEvents.abi, SetsAndEvents.networks[id].address, { from: accounts[0] })  
  
    await Vue.nextTick()
  })

  it('manually binds a call', async () => {  
    var vm = new Vue({
      data: {
        number: null
      },

      web3: {
        number: {
          contract: setsAndEvents,
          method: 'getNumber'
        }
      },

      template: '<div> {{ number }} </div>'
    })
  
    await new Promise(resolve => vm.$once('CALL_SYNCED', resolve))
    expect(vm.number).to.be.bignumber.equal(42)

    let second = new Promise(resolve => vm.$once('CALL_SYNCED', resolve))
    let txn = await setsAndEvents.methods.addOne().send()
    await second
    expect(vm.number).to.be.bignumber.equal(43)
  })

  it('manually binds events', async () => {
    
    await setsAndEvents.methods.doSomething(1).send()
    
    var vm = new Vue({
      data: {
        items: []
      },

      web3: {
        items: {
          contract: setsAndEvents,
          event: 'SomethingHappened'
        }
      },

      template: '<div><div v-for="item in items">{{ item.returnValues._value }}</div></div>'
    })

    await new Promise(resolve => vm.$once('EVENTS_SYNCED', resolve))
    expect(vm.items.length).to.equal(1)

    let second = new Promise(resolve => vm.$once('EVENT_SYNCED', resolve))
    await setsAndEvents.methods.doSomething(2).send()
    await second
    expect(vm.items.length).to.equal(2)
  })

  
})