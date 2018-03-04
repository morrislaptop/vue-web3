import Vue from 'vue'
import VueWeb3 from '../src'
import ganache from 'ganache-cli'
import Promise from 'bluebird'
const path = require('path')
const chai = require('chai')
const chaiBigNumber = require('chai-bignumber')
const expect = chai.expect
const SetsAndEvents = artifacts.require('./SetsAndEvents.sol')

web3.currentProvider.sendAsync = function () {
  return web3.currentProvider.send.apply(web3.currentProvider, arguments)
}

Vue.config.productionTip = false
Vue.use(VueWeb3, { provider: web3.currentProvider })
chai.use(chaiBigNumber())

contract('Bind', accounts => {
  let vm

  before(async () => {
    vm = new Vue({
      data: () => ({
        number: null
      })
    })
  
    await Vue.nextTick()
  })

  it('manually binds a call', async () => {
    expect(vm.number).to.equal(null)

    let setsAndEvents = await SetsAndEvents.deployed()
  
    await vm.$bindCall('number', {
        method: 'getNumber',
        contract: setsAndEvents,
    })
  
    expect(vm.number).to.be.bignumber.equal(42)

    let txn = await setsAndEvents.addOne()

    vm.$on('CALL_MADE', function () {
      expect(vm.number).to.be.bignumber.equal(43)
    })
  })
})