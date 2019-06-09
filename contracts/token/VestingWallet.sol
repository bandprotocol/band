pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC20Interface.sol";


contract VestingWallet is Ownable {
  using SafeMath for uint256;

  ERC20Interface public token;
  address public beneficiary;
  uint64 public cliffDuration;                /// Duration of the cliff, in months
  uint64 public endOfCliffTimestamp;          /// Timestamp when cliff ends that token starts vesting
  uint256 public totalValue;                  /// Total vesting token
  uint256[] public eomTimestampsAfterCliff;   /// Timestamps of all vesting months

  constructor(
    ERC20Interface _token,
    address _beneficiary,
    uint64 _cliffDuration,
    uint64 _endOfCliffTimestamp,
    uint256 _totalValue,
    uint256[] memory _eomTimestamps
  ) public {
    token = _token;
    beneficiary = _beneficiary;
    cliffDuration = _cliffDuration;
    endOfCliffTimestamp = _endOfCliffTimestamp;
    totalValue = _totalValue;
    for (uint256 i = 0; i < _eomTimestamps.length; ++i) {
      eomTimestampsAfterCliff.push(_eomTimestamps[i]);
    }
  }

  function release() public {
    require(now > endOfCliffTimestamp);
    uint256 earliestUnvestedMonthIndex = _getEarliestUnvestedMonthIndex();
    uint256 unvestedDuration = eomTimestampsAfterCliff.length.sub(earliestUnvestedMonthIndex);
    uint256 totalDuration = eomTimestampsAfterCliff.length.add(cliffDuration);
    uint256 unvestedToken = totalValue.mul(unvestedDuration).div(totalDuration);
    uint256 releasableToken = token.balanceOf(address(this)).sub(unvestedToken);
    require(releasableToken > 0 && token.transfer(beneficiary, releasableToken));
  }

  function revoke() public onlyOwner {
    require(token.transfer(msg.sender, token.balanceOf(address(this))));
    selfdestruct(msg.sender);
  }

  function _getEarliestUnvestedMonthIndex() internal view returns (uint256) {
    for (uint256 i = 0; i < eomTimestampsAfterCliff.length; ++i) {
      if (now < eomTimestampsAfterCliff[i]) return i;
    }
    return eomTimestampsAfterCliff.length;
  }
}
