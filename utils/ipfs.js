const hashUtility = require('../client/src/utils/hash');

function IPFS() {
    const self = this;
    self.fakeStorage = {};

    self.fakeStore = function (data) {
        const ipfsHash = hashUtility.generateRandomIPFSHash();
        self.fakeStorage[ipfsHash] = data;
        return ipfsHash;
    }

    self.fakeRetrieve = function(ipfsHash) {
        return self.fakeStorage[ipfsHash];
    }

    return self;
}

module.exports = new IPFS();