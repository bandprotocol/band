pragma solidity 0.5.0;

import "./AdminInterface.sol";
import "./CommunityCore.sol";
import "./SimpleTCR.sol";


/**
 * @title AdminTCR
 *
 * @dev Admin TCR contract is a Token Curated Registry contract to keep track
 * of a particular community's admins. That is, each data in TCR is an Ethereum
 * address.
 */
contract AdminTCR is AdminInterface, SimpleTCR {

  constructor(
    CommunityCore _core,
    VotingInterface _voting,
    uint256[] memory _expressions
  )
    SimpleTCR("admin:", _core, _voting, _expressions)
    public
  {
    // Make the contract creator the admin. Note that this is without deposit,
    // so any challenge will kick this admin out.
    bytes32 data = bytes32(uint256(msg.sender));
    entries[data].proposer = msg.sender;
    entries[data].listedAt = now;
    emit ApplicationSubmitted(data, msg.sender, entries[data].listedAt, 0);
  }

  function toTCREntry(address account) public pure returns (bytes32) {
    return bytes32(uint256(account));
  }

  /**
   * @dev Return whether the given address is an admin at the moment.
   */
  function isAdmin(address account) public view returns (bool) {
    return isEntryActive(toTCREntry(account));
  }
}
