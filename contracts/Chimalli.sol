pragma solidity 0.5.0;

contract Chimalli {

    event LogAddedSecret(address indexed secretOwner, bytes32 ipfsHash, bytes32 secretHash);

    address public owner;
    mapping (address => Secret) public secrets;
    mapping (bytes32 => uint256) private indicies;

    struct Secret {
        bytes32 ipfsHash;
        bytes32 nameHash;
    }

    constructor() public {
        owner = msg.sender;
    }

    function store(bytes32 _ipfsHash, bytes32 _nameHash)
    external
    {
        secrets[msg.sender] = (
            Secret({ 
            ipfsHash: _ipfsHash,
            nameHash: _nameHash
            })
        );
        
        emit LogAddedSecret(msg.sender, _ipfsHash, _nameHash);
    }

    function retrieve()
    external
    view
    returns (bytes32, bytes32)
    {
        return (secrets[msg.sender].ipfsHash, secrets[msg.sender].nameHash);
    }
}