import range from 'ramda/src/range'
import Q from 'q'
import CodexContract from "../contracts/Codex.json";


class Codex {
  constructor(web3) {
    this.web3 = web3;
  }
  async start() {
    console.log('[ Codex ] start | Initializing Codex...');
    try {
      const networkId = await this.web3.eth.net.getId();
      const deployedNetwork = CodexContract.networks[networkId];
      const instance = new this.web3.eth.Contract(
        CodexContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.contract = instance;
      return 'loaded';
    } catch (error) {
      console.error(error);
    }
  };

  loadCodex = async () => {
    const { contract } = this;
    const codexLength = Number(await contract.methods.getCodexLength().call());
    const codex = await Q.allSettled(range(0,codexLength).map(async (index) =>     
      await contract.methods.getChimalli(index).call()
    ))
    return codex.map( wrappedChimalli => wrappedChimalli.value );
  };
};

export default Codex;