pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC20Base.sol";

/**
 * @dev SnapshotToken keeps track of all balance changes ever existed.
 * Useful for taking voting power snapshot when conducting a poll.
 */
contract SnapshotToken is ERC20Base {
  using SafeMath for uint256;

  /**
   * @dev IMPORTANT: votingPowers are kept as a linked list of ALL historical changes.
   *
   * For instance, if an address has the following balance list:
   *  (0, 0) -> (13, 100) -> (14, 90) -> (16, 95)
   * It means the historical voting power of the address is:
   *    [at nonce=13] Receive 100 voting power
   *    [at nonce=14] Lose 10 voting power
   *    [at nonce=16] Receive 5 voting power
   *
   * This allows the contract to figure out voting power of the address at any
   * nonce `n`, by searching for the node that has the biggest nonce
   * that is not greater than `n`.
   *
   * For efficiency, nonce and power are packed into one uint256 integer,
   * with the top 64 bits representing nonce, and the bottom 192 bits
   * representing voting power.
   */
  mapping (address => mapping(uint256 => uint256)) _votingPower;
  mapping (address => uint256) public votingPowerChangeCount;
  uint256 public votingPowerChangeNonce = 0;

  /**
   * @dev Returns user voting power at the given index, that is, as of the
   * user's index^th voting power change
   */
  function historicalVotingPowerAtIndex(address owner, uint256 index)
    public
    view
    returns (uint256)
  {
    require(index <= votingPowerChangeCount[owner]);
    return _votingPower[owner][index] & ((1 << 192) - 1);  // Lower 192 bits
  }

  /**
   * @dev Returns user voting power at the given time. Under the hood, this
   * performs binary search to look for the largest index at which the
   * nonce is not greater than 'nonce'. The voting power at that index is
   * the returning value.
   */
  function historicalVotingPowerAtNonce(address owner, uint256 nonce)
    public
    view
    returns (uint256)
  {
    require(nonce <= votingPowerChangeNonce);
    require(nonce < (1 << 64));
    uint256 start = 0;
    uint256 end = votingPowerChangeCount[owner];
    // The gas cost of this binary search is approximately 200 * log2(lastNonce)
    while (start < end) {
      // Doing ((start + end + 1) / 2) here to prevent infinite loop.
      uint256 mid = start.add(end).add(1).div(2);
      if ((_votingPower[owner][mid] >> 192) > nonce) { // Upper 64 bits nonce
        // If midTime > nonce, this mid can't possibly be the answer
        end = mid.sub(1);
      } else {
        // Otherwise, search on the greater side, but still keep mid as a
        // possible option.
        start = mid;
      }
    }
    // Double check again that the binary search is correct.
    assert((_votingPower[owner][start] >> 192) <= nonce);
    if (start < votingPowerChangeCount[owner]) {
      assert((_votingPower[owner][start + 1] >> 192) > nonce);
    }
    return historicalVotingPowerAtIndex(owner, start);
  }

  function _transfer(address from, address to, uint256 value) internal {
    super._transfer(from, to, value);
    votingPowerChangeNonce = votingPowerChangeNonce.add(1);
    _changeVotingPower(from);
    _changeVotingPower(to);
  }

  function _mint(address account, uint256 amount) internal {
    super._mint(account, amount);
    votingPowerChangeNonce = votingPowerChangeNonce.add(1);
    _changeVotingPower(account);
  }

  function _burn(address account, uint256 amount) internal {
    super._burn(account, amount);
    votingPowerChangeNonce = votingPowerChangeNonce.add(1);
    _changeVotingPower(account);
  }

  function _changeVotingPower(address account) internal {
    uint256 currentIndex = votingPowerChangeCount[account];
    uint256 newPower = balanceOf(account);
    require(newPower < (1 << 192));
    require(votingPowerChangeNonce < (1 << 64));
    currentIndex = currentIndex.add(1);
    votingPowerChangeCount[account] = currentIndex;
    _votingPower[account][currentIndex] = (votingPowerChangeNonce << 192) | newPower;
  }
}
