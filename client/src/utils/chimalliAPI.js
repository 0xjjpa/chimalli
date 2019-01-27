import ChimalliContract from "../contracts/Chimalli.json";

class Chimalli {
  constructor(web3, address) {
    console.log('[ Chimalli ] load | address', address);
    this.web3 = web3;
    try {
      const instance = new this.web3.eth.Contract(
        ChimalliContract.abi,
        address
      );
      this.instance = instance;
    } catch (error) {
      console.error(error);
    }
  };

  getKeeper = async () => {
    const { instance } = this;
    const keeperAddress = await instance.methods.keeper().call();
    return keeperAddress;
  };
};

export default Chimalli;