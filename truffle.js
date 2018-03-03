require('babel-register')
const ganache = require("ganache-cli")

module.exports = {
  networks: {
    test: {
      network_id: "*",
      provider: ganache.provider(),
      test: true,
    }
  }
};
