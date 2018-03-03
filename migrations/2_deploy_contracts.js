var SetsAndEvents = artifacts.require("./SetsAndEvents.sol")

module.exports = function(deployer) {
  deployer.deploy(SetsAndEvents)
};
