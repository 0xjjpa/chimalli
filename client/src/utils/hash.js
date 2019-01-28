const { Keccak } = require('sha3');
const multihashes = require('multihashes')
const { randomBytes } = require('crypto')

function Hash() {
    var self = this;
    // Simulate an IPFS Hash, we would obtain this from the IPFS API
    self.generateRandomIPFSHash = function() {
        const buffer = Buffer.from(randomBytes(32), 'hex')
        const encoded = multihashes.encode(buffer, 'sha2-256')
        const ipfsHash = multihashes.toB58String(encoded)
        return ipfsHash;
    }
    // Parse a IPFS Hash into a Bytes32 Solidity compatible hash
    self.parseIPFSHashIntoBytes32 = function(ipfsHash) {
        const multihash = multihashes.fromB58String(Buffer.from(ipfsHash))
        const bytes32_ipfsHash = '0x' + multihash.slice(2).toString('hex');
        return bytes32_ipfsHash;
    }
    self.generateRandomIPFSHashBytes32 = function() {
        return self.parseIPFSHashIntoBytes32(self.generateRandomIPFSHash());
    }
    // Obtain a Keccak256 hash from a string
    self.hashNameIntoKeccak256Bytes32 = function(name) {
        const hash = new Keccak(256);
        hash.update(name);
        const bytes32_nameHash = '0x' + hash.digest('hex');
        return bytes32_nameHash;
    }
    return self;
}

module.exports = new Hash();