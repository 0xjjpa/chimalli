const Codex = artifacts.require("./Codex.sol");
const Chimalli = artifacts.require("./Chimalli.sol");

module.exports = function(deployer, network, accounts) {
  // Deploying a Chimalli as a side contract for testing on development
  if (network === 'development' ) {
    const friend1 = accounts[1];
    deployer.deploy(Chimalli, accounts[1]);
  }
  deployer.deploy(Codex);
};
