pragma solidity 0.5.0;

contract Chimalli {

    event LogAddedSecret(address indexed secretOwner, bytes32 ipfsHash, bytes32 secretHash);

    address payable public owner;
    mapping (address => Secret) public secrets;
    mapping (bytes32 => uint256) private indicies;

    struct Secret {
        bytes32 ipfsHash;
        bytes32 nameHash;
    }

    constructor(address payable _owner) public {
        owner = _owner;
    }

    modifier isOwner() {require(msg.sender == owner, "Only the secret keeper can destroy the chimalli"); _;}

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

    function keeper() 
    external
    view
    returns (address)
    {
        return owner;
    }

    function kill()
    public
    isOwner
    {
        selfdestruct(owner);
    }
}