import ChimalliContract from "../contracts/Chimalli.json";
const hashUtility = require('./hash');
const IPFS = require('./ipfs');

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

  getPieceFromIPFS = (secret) => {
    console.log('Secret', secret);
    //const ipfsHash = hashUtility.parseBytes32IntoHash(secret);
    return IPFS.bytes32Hash_fakeRetrieve(secret);
  }

  getSecret = async () => {
    const { instance } = this;
    const secretPiece = await instance.methods.retrieve().call();
    console.log('[ Chimalli ] getSecret | secretPiece', secretPiece);
    return secretPiece;
  }

  storeSecret = async (secret, piece, cb) => {
    const { instance, web3 } = this;
    const [ account ] = await web3.eth.getAccounts();
    
    const bytes32_nameHash = hashUtility.hashNameIntoKeccak256Bytes32(secret)
    const bytes32_ipfsHash = hashUtility.generateRandomIPFSHashBytes32();
    IPFS.bytes32Hash_fakeStore(bytes32_ipfsHash, piece);

    const price = await web3.eth.getGasPrice()
    const request = await instance.methods.store(bytes32_ipfsHash, bytes32_nameHash);
    const estimatedGas = await request.estimateGas({ from: account });
    const transactionDetails = { from: account, gas: estimatedGas, gasPrice: price };

    const receipt = await request.send(transactionDetails)
      .on('transactionHash', transactionHash => {
        cb(`Success, your transaction hash is ${transactionHash}. Please monitor the status of the transaction.`)
      })
      .on('error', error => {
        cb(`There was an error storing your secret: ${error}`)
      })

    return receipt;
  }
};

export default Chimalli;