const Codex = artifacts.require("./Codex.sol");
const Chimalli = artifacts.require("./Chimalli.sol");

module.exports = function(deployer, network, accounts) {
  const friend1 = accounts[1];

  // Deploying Chimalli as a side contract for testing
  deployer.deploy(Chimalli, accounts[1]);

  deployer.deploy(Codex).then((codex) => {
    // We create 3 Chimallis to start storing secret in those
    codex.createChimalli(accounts[1]);
    codex.createChimalli(accounts[2]);
    codex.createChimalli(accounts[3]);
  });
};
