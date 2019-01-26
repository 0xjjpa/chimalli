import React, { Component } from "react";
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import getWeb3 from "../../utils/getWeb3";

import generator from 'keybase-generator';

const EMPTY_KEYS = { privateKey: '', publicKey: ''}
const GENERATING_KEYS_MESSAGE = 'Generating... (takes about 1-2 minutes)'
const GENERATING_KEYS_IN_PROGRESS = 'Keys already generating, please wait...'
const DEFAULT_PASSWORD = 'password'
const DEFAULT_USERID = 'Jose Aguinaga <me@jjperezaguinaga.com>'

class Keys extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null, 
    keypair: {
      privateKey: localStorage.getItem('privateKey'),
      publicKey: localStorage.getItem('publicKey')
    },
    keypairMessage: 'Generate Keys',
    generatingKeys: false
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(15).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  async generateKeys() {
      if(this.state.generatingKeys) {
        this.setState({
          keypairMessage: GENERATING_KEYS_IN_PROGRESS
        }, () => setTimeout(this.setState({ keypairMessage: GENERATING_KEYS_MESSAGE }), 3000))
      } else {
        this.setState({ generatingKeys: true, keypair: EMPTY_KEYS, keypairMessage: GENERATING_KEYS_MESSAGE })

        const password = DEFAULT_PASSWORD;
        const userId = DEFAULT_USERID;

        const keypair = await generator(userId, password);
        localStorage.setItem('publicKey', keypair.publicKey);
        localStorage.setItem('privateKey', keypair.privateKey);

        this.setState({ keypair, generatingKeys: false });
      }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    console.log('Loading');
    const { privateKey, publicKey } = this.state.keypair;
    console.log('Keypair', privateKey, publicKey);

    return (
      <div>
        <h2>PGP Encryption</h2>
        {
          privateKey && publicKey ?
          <div>
            <p>Private Key</p>
            <pre>
              { privateKey }
            </pre>
            <p>Public Key</p>
            <pre>
              { publicKey }
            </pre>
            <button onClick={() => this.generateKeys()}>Regenerate Keys</button>
          </div>
          : 
          <p>
            { 
              this.state.generatingKeys ?
              <span> We are now generating a RSA-4096 bits key pair <br/></span> :
              <span>Generate a PGP private and public key pair<br/></span>
            }
            <button onClick={() => this.generateKeys()}>{ this.state.keypairMessage } </button>
          </p>
        }
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
