import Vue from 'vue'
import VueWeb3 from '../src'
import ganache from 'ganache-cli'
import Promise from 'bluebird'
const path = require('path')

const chai = require('chai')
chai.use(require('chai-bignumber')())
const expect = chai.expect
const Deployer = require("truffle-deployer")
const provider = ganache.provider()

const SetsAndEvents = artifacts.require('./SetsAndEvents.sol')

Vue.config.productionTip = false
Vue.use(VueWeb3, { provider })

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
  })
})