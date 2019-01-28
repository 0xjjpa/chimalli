const { shouldFail } = require('openzeppelin-test-helpers');77
const Codex = artifacts.require('./Codex.sol');
const Q = require('q');
const secretMock = require('../mocks/secrets');
const hashUtility = require('../client/src/utils/hash');
const IPFS = require('../utils/ipfs');

contract('Codex - Basic', accounts => {
    it('...should have no Chimalli deployed', async() => {
        const CodexInstance = await Codex.deployed();

        const codexLength = await CodexInstance.getCodexLength.call(accounts[0]);
        assert.equal(codexLength.toString(), 0, 'Codex should have 0 Chimallis deployed');
    })

    it('...should create three Chimalli', async() => {
        const CodexInstance = await Codex.deployed();

        await CodexInstance.createChimalli(accounts[1]);
        await CodexInstance.createChimalli(accounts[2]);

        const codexLength = await CodexInstance.getCodexLength.call(accounts[0]);
        assert.equal(codexLength.toString(), 2, 'Codex didn‘t create 2 Chimallis');
    })

})

contract('Codex - Storage', accounts => {
    it('...should store of encrypted pieces in our Chimallis', async() => {
        const CodexInstance = await Codex.deployed();

        await CodexInstance.createChimalli(accounts[1], { from: accounts[0] });
        const codexLength = await CodexInstance.getCodexLength.call(accounts[0]);

        assert.equal(codexLength.toString(), 1, 'Codex didn‘t create 1 Chimallis');

        const bytes32_random1 = hashUtility.generateRandomIPFSHashBytes32()
        const bytes32_random2 = hashUtility.generateRandomIPFSHashBytes32()

        const index = 0
        const responseStorage = await CodexInstance.storeSecretPiece.call(index, bytes32_random1, bytes32_random2);
        console.log('Resposnse Storage', responseStorage);
        const storedSecret = await CodexInstance.retrievePiece.call(index);

        console.log('Stored Secret', storedSecret);

    });
})

// contract('Codex - Encryption', accounts => {
//     it('...should be able to store encrypted pieces and decrypt them back', async() => {
//         const CodexInstance = await Codex.deployed();

//         await CodexInstance.createChimalli(accounts[1], { from: accounts[0] });
//         await CodexInstance.createChimalli(accounts[2], { from: accounts[0] });
//         await CodexInstance.createChimalli(accounts[3], { from: accounts[0] });

//         const codexLength = await CodexInstance.getCodexLength.call(accounts[0]);
//         assert.equal(codexLength.toString(), 3, 'Codex didn‘t create 3 Chimallis');

//         const pieces = [secretMock.PIECE_1, secretMock.PIECE_2, secretMock.PIECE_3]
//         const bytes32_nameHash = hashUtility.hashNameIntoKeccak256Bytes32(secretMock.SECRET)
        
//         const storedSecrets = await Q.allSettled(pieces.map( async (piece, index) => {
//             const ipfsPieceHash = IPFS.fakeStore(piece);
//             const bytes32_ipfsHash = hashUtility.parseIPFSHashIntoBytes32(ipfsPieceHash);
//             console.log('Storing secret', accounts[index + 1], index, bytes32_nameHash, bytes32_ipfsHash);
//             return await CodexInstance.storeSecretPiece.call(accounts[index + 1], index, bytes32_nameHash, bytes32_ipfsHash);
//         }))

//         const retrievedPiece = await CodexInstance.retrievePiece.call(0);
//         console.log('Retrieved Piece', retrievedPiece)

//         console.log('Stored Secrets', storedSecrets);
//         const piecesLength = await CodexInstance.getPiecesLength.call(accounts[1], { from: accounts[0] });
//         assert.equal(piecesLength.toString(), 3, 'Codex has more than 3 pieces');
//     })
// })