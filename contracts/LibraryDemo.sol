pragma solidity ^0.5.0;

import "./Chimalli.sol";
import { Seriality } from "./Seriality.sol";

/*
 * @title Library Demo
 * @notice Demo for showcasing the usage of a library.
 * @author Jose Aguinaga (@jjperezaguinaga) <me@jjperezaguinaga.com>
 * @dev The idea was that instead of storing one secret piece, we could store at least two and paste those out serialized.
 */
contract LibraryDemo is Seriality {
    address public owner;

    mapping (address => Secret[]) secrets;

    struct Secret {
        string ipfsHash;
        bytes32 nameHash;
    }

    constructor() public {
        owner = msg.sender;
    }

    /*
     * @title storeMultiple
     * @notice Our storing method for the keeping multiple secrets in our Chimalli
     * @type function
     * @param (string) _ipfsHash   = The IPFS with the location of the encrypted secret
     * @param (bytes32) _nameHash   = The hash of the name of the secret as an identifier 
     */
    function storeMultiple(string calldata _ipfsHash, bytes32 _nameHash)
    external
    {
        secrets[msg.sender].push(
            Secret({
                ipfsHash: _ipfsHash,
                nameHash: _nameHash
            })
        );
    }

    function getBytes(uint _startindex, uint _endindex)
    public 
    view 
    returns(bytes memory serialized)
    {

        require(_endindex >= _startindex);
        
        if(_endindex > (secrets[msg.sender].length - 1)){
            _endindex = secrets[msg.sender].length - 1;
        }
        
        // 64 byte is needed for safe storage of a single string.
        // ((_endindex - _startindex) + 1) is the number of strings we want to pull out.
        uint offset = 64*((_endindex - _startindex) + 1);
        
        bytes memory buffer = new  bytes(offset);
        Secret memory secret;
        string memory out1 = new string(32);
        
        
        for(uint i = _startindex; i <= _endindex; i++){
            secret = secrets[msg.sender][i];
            out1 = secret.ipfsHash;
            
            stringToBytes(offset, bytes(out1), buffer);
            offset -= sizeOfString(out1);
        }
        
        return (buffer);
    }
    
    function getString(bytes memory buffer)
    public 
    pure
    returns(string memory string1, string memory string2) 
    {

    	//64 byte is needed for safe storage of a single string.
    	//In this example we are returning 2 strings
    	uint offset = 64*2;

    	buffer = new  bytes(offset);

    	string1 = new string(32);
    	string2 = new string(32);

    	bytesToString(offset, buffer, bytes(string2));
        offset -= sizeOfString(string2);

		bytesToString(offset, buffer, bytes(string2));
        offset -= sizeOfString(string2);

        return(string1, string2);
    }

    /*
     * @title retrieve
     * @notice Our retrieval method for getting back stored secrets within our Chimalli
     * @type function
     * @return (string, string) The serialized version of at least two secrets per chimalli
     */
    function retrieve()
    external
    view
    returns (string memory, string memory)
    {
        bytes memory bufferedSecret = getBytes(0,1);
        return getString(bufferedSecret);
    }
}