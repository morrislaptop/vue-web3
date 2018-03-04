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
    vm = new Vue({
      data: () => ({
        items: [],
        number: null
      })
    })

    _web3.eth.defaultAccount = accounts[0]
    let id = await _web3.eth.net.getId()
    setsAndEvents = new _web3.eth.Contract(SetsAndEvents.abi, SetsAndEvents.networks[id].address, { from: accounts[0] })  
  
    await Vue.nextTick()
  })

  it('manually binds a call', async () => {
    expect(vm.number).to.equal(null)
  
    await vm.$bindCall('number', {
        method: 'getNumber',
        contract: setsAndEvents,
    })
  
    expect(vm.number).to.be.bignumber.equal(42)

    let txn = await setsAndEvents.methods.addOne().send()

    vm.$on('CALL_MADE', function () {
      expect(vm.number).to.be.bignumber.equal(43)
    })
  })

  it.only('manually binds events', async () => {
    expect(vm.items.length).to.equal(0)

    await setsAndEvents.methods.doSomething(1).send()

    let first = new Promise(resolve => {
      vm.$once('EVENT_SYNCED', function () {
        expect(vm.items.length).to.equal(1)
        resolve()
      })  
    })

    await vm.$bindEvents('items', {
      event: 'SomethingHappened',
      contract: setsAndEvents,
      options: {
        fromBlock: 0,
        toBlock: 'latest'
      }
    })
    await first

    let second = new Promise(resolve => {
      vm.$once('EVENT_SYNCED', function (e) {
        expect(vm.items.length).to.equal(2)
        resolve()
      })
    })

    await setsAndEvents.methods.doSomething(2).send()
    await second
  })
})