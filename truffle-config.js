require('dotenv').config()

const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const infura_apikey = process.env.INFURA_PROJECT_ID;
const mnemonic = process.env.MNEMONIC;

const CONFIG = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten:  {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + infura_apikey),
      network_id: 3,
      gas: 4500000
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};

module.exports = CONFIG;