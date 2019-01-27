pragma solidity 0.5.0;

import "./Chimalli.sol";

/*
 * @title Codex
 * @notice Storage manager for Chimalli type of contracts.
 * @author Jose Aguinaga (@jjperezaguinaga) <me@jjperezaguinaga.com>
 */
contract Codex {
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
        emit LogChimalliCreated(chimalli, _address);
        codex[msg.sender].push(chimalli);
    }

    /*
     * @title getCodexLength
     * @notice Our codex getter for seeing how many Chimallis per contract we have.
     * @type function
     * @return (uint) The amount of Chimallis stored in our Codex per owner.
     */
    function getCodexLength()
    public
    view
    returns (uint) {
        return codex[msg.sender].length;
    }

    /*
     * @title getChimalli
     * @notice Our codex getter for seeing the address of a specific chimalli.
     * @type function
     * @param (uint) _index = The index of the Chimalli’s contract we want to obtain per sender.
     * @return (Chimalli) The address of the sender’s Chimalli’s contract within our Codex.
     */
    function getChimalli(uint _index)
    public
    view
    returns (Chimalli) {
        return codex[msg.sender][_index];
    }
}