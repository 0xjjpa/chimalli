pragma solidity 0.5.0;

import "./Chimalli.sol";

/*
 * @title Codex
 * @notice Storage manager for Chimalli type of contracts.
 * @author Jose Aguinaga (@jjperezaguinaga) <me@jjperezaguinaga.com>
 */
contract Codex {
    enum Status { NOT_ADDED, ADDED }
    Status status;
    address public owner;
    mapping (address => Chimalli[]) public codex;

    /*
     * @title LogChimalliCreated
     * @notice Event for notifying whenever a chimalli has been successfully added to our Codex
     * @type event
     * @param (Chimalli) _chimalli  = The address of the newly created chimalli contract
     * @param (address) _address    = The address of the owner of the newly created chimalli
     */
    event LogChimalliCreated(Chimalli _chimalli, address _address);
    event LogSecretStored(address _address, uint _index, bytes32 _nameHash, bytes32 _ipfsHash);

    /*
     * @title constructor
     * @notice Our contract constructor, which receives no argument
     * @type constructor
     */
    constructor() public {
        owner = msg.sender;
    }

    /*
     * @title createChimalli
     * @notice Our chimalli factory method, allows us to create Chimalli contracts on demand
     * @type function
     * @param (address) _address   = The address of the Chimalli’s secret keeper
     */
    function createChimalli(address payable _address) 
    external
    {
        Chimalli chimalli = new Chimalli(_address);
        codex[msg.sender].push(chimalli);
        emit LogChimalliCreated(chimalli, _address);
    }

    /*
     * @title storeSecretPiece
     * @notice Our storage method for inserting data into chimallis
     * @type function
     * @param (uint) _index         = The index of the Chimalli we'll use from the keeper
     * @param (bytes32) _nameHash   = The hash of the name of the secret we are storing
     * @param (bytes32) _ipfsHash   = The ipfs hash with the location of the secret
     */
    function storeSecretPiece(uint _index, bytes32 _nameHash, bytes32 _ipfsHash)
    external
    returns(bytes32, bytes32)
    {
        Chimalli chimalli = codex[msg.sender][_index];
        chimalli.store(_nameHash, _ipfsHash);
        emit LogSecretStored(msg.sender, _index, _nameHash, _ipfsHash);
        return codex[msg.sender][_index].retrieve();
    }

    function retrievePiece(uint _index)
    view
    external
    returns (bytes32, bytes32)
    {
        return codex[msg.sender][_index].retrieve();
    }

    /*
     * @title getCodexLength
     * @notice Our codex getter for seeing how many Chimallis per keeper we have.
     * @type function
     * @param (address) _address = The address of the secret keeper we want to know how many chimallis has
     * @return (uint) The amount of Chimallis stored in our Codex per keeper.
     */
    function getCodexLength(address _address)
    public
    view
    returns (uint) {
        return codex[_address].length;
    }

    /*
     * @title getPiecesLength
     * @notice Our pieces getter for seeing how many pieces we have per secret
     * @type function
     * @param (bytes32) _nameHash = The hash of the secret we are storing in our codex.
     * @return (uint) The amount of Chimallis stored in our Codex per keeper.
     */
    function getPiecesLength(address _address)
    public
    view
    returns (uint) {
        uint chimallisLength = codex[msg.sender].length;
        return chimallisLength;
        uint piecesCounter = 0;
        for (uint i = 0; i < chimallisLength; i++) {
            if (codex[msg.sender][i].hasSecret()) {
                piecesCounter++;
            }
        }
        return piecesCounter;
    }

    /*
     * @title getChimalli
     * @notice Our codex getter for seeing the address of a specific chimalli.
     * @type function
     * @param (address) _address = The address of the Chimalli’s secret keeper
     * @param (uint) _index = The index of the Chimalli’s contract we want to obtain per sender.
     * @return (Chimalli) The address of the sender’s Chimalli’s contract within our Codex.
     */
    function getChimalli(address _address, uint _index)
    public
    view
    returns (Chimalli) {
        return codex[_address][_index];
    }
}