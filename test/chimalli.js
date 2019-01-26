const Chimalli = artifacts.require('./Chimalli.sol');
const { Keccak } = require('sha3');
const multihashes = require('multihashes')
const { randomBytes } = require('crypto')


contract('Chimalli', accounts => {
  it('...should store a secret with an IPFS Hash and a keccak256 hash of the secret name', async () => {
    const ChimalliInstance = await Chimalli.deployed();

    // Simulate an IPFS Hash, we would obtain this from the IPFS API
    const buffer = Buffer.from(randomBytes(32), 'hex')
    const encoded = multihashes.encode(buffer, 'sha2-256')
    const ipfsHash = multihashes.toB58String(encoded)

    // We now parse the IPFS Hash into a Bytes32 Solidity compatible hash
    const multihash = multihashes.fromB58String(Buffer.from(ipfsHash))
    const bytes32_ipfsHash = '0x' + multihash.slice(2).toString('hex');


    // Obtain a Keccak256 hash
    const hash = new Keccak(256);
    hash.update('My Gmail Password');
    const bytes32_nameHash = '0x' + hash.digest('hex');

    await ChimalliInstance.store(bytes32_ipfsHash, bytes32_nameHash, { from: accounts[0] });

    // Get stored secret
    const secret = await ChimalliInstance.retrieve.call();
    const [ contract_ipfsHash, contract_nameHash ] = Object.keys(secret).map( index => secret[index] )
    

    assert.equal(contract_ipfsHash, bytes32_ipfsHash, 'The IPFS Hash isn’t valid');
    assert.equal(contract_nameHash, bytes32_nameHash, 'The Name Hash isn’t valid');
  });
});
