const { shouldFail } = require('openzeppelin-test-helpers');
const Chimalli = artifacts.require('./Chimalli.sol');
const hashUtility = require('../client/src/utils/hash');

contract('Chimalli', accounts => {
  it('...should be deployed with a specific owner', async() => {
    const ChimalliInstance = await Chimalli.deployed();

    const friend1 = accounts[1];
    const keeper = await ChimalliInstance.keeper.call()

    assert.equal(keeper, friend1, 'The owner of the contract isn’t the secret keeper');
  })

  it('...should store a secret with an IPFS Hash and a keccak256 hash of the secret name', async () => {
    const ChimalliInstance = await Chimalli.deployed();

    const bytes32_ipfsHash = hashUtility.generateRandomIPFSHashBytes32();
    const bytes32_nameHash = hashUtility.hashNameIntoKeccak256Bytes32('My Gmail Password');

    assert.equal(await ChimalliInstance.hasSecret(), false, 'We shouldn’t have secret yet');
    await ChimalliInstance.store(bytes32_ipfsHash, bytes32_nameHash, { from: accounts[0] });
    assert.equal(await ChimalliInstance.hasSecret(), true, 'We dont have a secret stored');

    // Get stored secret
    const secret = await ChimalliInstance.retrieve.call();
    const [ contract_ipfsHash, contract_nameHash ] = Object.keys(secret).map( index => secret[index] )
    
    assert.equal(contract_ipfsHash, bytes32_ipfsHash, 'The IPFS Hash isn’t valid');
    assert.equal(contract_nameHash, bytes32_nameHash, 'The Name Hash isn’t valid');
  });

  it('...should only be possible to destroy the Chimally by the secret keeper', async() => {
    const ChimalliInstance = await Chimalli.deployed();
    await shouldFail.reverting(ChimalliInstance.kill.call({from: accounts[0]}));
    assert.deepEqual({}, await ChimalliInstance.kill.call({from: accounts[1]}));
  })
});
