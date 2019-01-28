const hashUtility = require('./hash');

function IPFS() {
    const self = this;
    self.fakeStorage = {};

    self.fakeStore = function (data) {
        const ipfsHash = hashUtility.generateRandomIPFSHash();
        localStorage && localStorage.setItem ? localStorage.setItem(ipfsHash, data) :  self.fakeStorage[ipfsHash] = data;
        return ipfsHash;
    }

    self.fakeRetrieve = function(ipfsHash) {
        return localStorage && localStorage.getItem ? localStorage.getItem(ipfsHash) : self.fakeStorage[ipfsHash];
    }

    self.bytes32Hash_fakeStore = function (bytes32hash, data) {
        localStorage && localStorage.setItem ? localStorage.setItem(bytes32hash, data) :  self.fakeStorage[bytes32hash] = data;
        return bytes32hash;
    }

    self.bytes32Hash_fakeRetrieve = function(bytes32hash) {
        return localStorage && localStorage.getItem ? localStorage.getItem(bytes32hash) : self.fakeStorage[bytes32hash];
    }

    return self;
}

module.exports = new IPFS();