pragma solidity 0.5.0;

import "./Chimalli.sol";

contract Codex {
    address public owner;
    mapping (address => Chimalli[]) public codex;

    event LogChimalliCreated(Chimalli _chimalli, address _address);

    constructor() public {
        owner = msg.sender;
    }

    function createChimalli(address payable _address) 
    external
    {
        Chimalli chimalli = new Chimalli(_address);
        emit LogChimalliCreated(chimalli, _address);
        codex[msg.sender].push(chimalli);
    }

    function getCodexLength()
    public
    view
    returns (uint) {
        return codex[msg.sender].length;
    }

    function getChimalli(uint index)
    public
    view
    returns (Chimalli) {
        return codex[msg.sender][index];
    }
}