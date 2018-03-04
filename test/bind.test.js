import Vue from 'vue'
import VueWeb3 from '../src'
import ganache from 'ganache-cli'
import Promise from 'bluebird'
import Web3 from 'web3'
const path = require('path')
const chai = require('chai')
const chaiBigNumber = require('chai-bignumber')
const expect = chai.expect
const SetsAndEvents = artifacts.require('./SetsAndEvents.sol')

// Fix this.provider.sendAsync is not a function for ganache-cli beta
web3.currentProvider.sendAsync = web3.currentProvider.sendAsync || function () {
  return web3.currentProvider.send.apply(web3.currentProvider, arguments)
}

// Use 1.0 of Web3
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

    let first = new Promise(resolve => vm.$once('EVENT_SYNCED', resolve))
    await setsAndEvents.methods.doSomething(1).send()
    await first
    expect(vm.items.length).to.equal(1)

    let second = new Promise(resolve => vm.$once('EVENT_SYNCED', resolve))
    await setsAndEvents.methods.doSomething(2).send()
    await second
    expect(vm.items.length).to.equal(2)
  })

  
})