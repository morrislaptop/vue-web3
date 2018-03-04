require('babel-register')
const ganache = require("ganache-cli")

module.exports = {
  networks: {
    test: {
      network_id: "*",
      provider: ganache.provider(),
      test: true,
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
