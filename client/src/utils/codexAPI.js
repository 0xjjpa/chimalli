import range from 'ramda/src/range'
import Q from 'q'
import CodexContract from "../contracts/Codex.json";


class Codex {
  constructor(web3) {
    this.web3 = web3;
  }
  async start() {
    console.log('[ Codex ] start | Initializing Codex');
    try {
      const networkId = await this.web3.eth.net.getId();
      console.log('[ Codex ] start | networkId ', networkId)
      const deployedNetwork = CodexContract.networks[networkId];
      console.log('[ Codex ] start | deployedNetwork ', deployedNetwork)
      const instance = new this.web3.eth.Contract(
        CodexContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.instance = instance;
      return 'loaded';
    } catch (error) {
      console.error(error);
    }
  };

  loadCodex = async (address) => {
    console.log('[ Codex ] loadCodex | address - Loading codex for the following address', address)
    const { instance } = this;
    const codexLength = Number(await instance.methods.getCodexLength(address).call());
    const codex = await Q.allSettled(range(0,codexLength).map(async (index) =>     
      await instance.methods.getChimalli(address, index).call()
    ))
    return codex.map( wrappedChimalli => wrappedChimalli.value );
  };

  createChimalli = async (keeper, cb) => {
    const { instance, web3 } = this;
    const [ account ] = await web3.eth.getAccounts();
    const price = await web3.eth.getGasPrice()
    const request = await instance.methods.createChimalli(keeper)
    const estimatedGas = await request.estimateGas({ from: account });
    const transactionDetails = { from: account, gas: estimatedGas, gasPrice: price };

    const receipt = await request.send(transactionDetails)
      .on('transactionHash', transactionHash => {
        cb(`Success, your transaction hash is ${transactionHash}. Please monitor the status of the transaction.`)
      })
      .on('error', error => {
        cb(`There was an error creating your Chimalli: ${error}`)
      })

    return receipt;
  };
};

export default Codex;