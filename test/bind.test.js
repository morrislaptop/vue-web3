import Vue from 'vue'
import VueWeb3 from '../src'
import Throw from './fixtures/Throw'

Vue.config.productionTip = false
Vue.use(VueWeb3, { provider: null })

let vm

beforeEach(async () => {
  vm = new Vue({
    data: () => ({
      time: null
    })
  })
  await tick()
})

test('manually binds a call', async () => {
  expect(vm.time).toEqual(null)

  await vm.$bindCall('time', {
      method: 'throwTime',
      abi: Throw.abi,
      address: Throw.networks[5777].address
  })

  expect(vm.time).toEqual(10)
})