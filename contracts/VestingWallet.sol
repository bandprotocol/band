pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./token/ERC20Interface.sol";

contract VestingWallet is Ownable {
  using SafeMath for uint256;

  event TokenReleased(address indexed beneficiary, uint256 value);

  ERC20Interface public token;
  address public beneficiary;
  uint64 public cliff;        // Duration of the cliff, with respect to the grant start day, in months.
  uint64 public endOfCliff;   // Timestamp when cliff period end
  uint256 public totalValue;  // Total vesting token

  uint256[] public eomTimestampsAfterCliff;

  constructor(
    ERC20Interface _token,
    address _beneficiary,
    uint64 _cliff,
    uint64 _endOfCliff,
    uint256 _totalValue,
    uint256[] memory _eomTimestamps
  )
    public
  {
    token = _token;
    beneficiary = _beneficiary;
    cliff = _cliff;
    endOfCliff = _endOfCliff;
    totalValue = _totalValue;
    for (uint256 i = 0; i < _eomTimestamps.length; ++i) {
      eomTimestampsAfterCliff.push(_eomTimestamps[i]);
    }
  }

  function release() public {
    require(now > endOfCliff);
    uint256 monthIndex = _getMonthIndex();
    uint256 duration = eomTimestampsAfterCliff.length;
    uint256 unvestedToken = totalValue.mul(duration.sub(monthIndex)).div(duration.add(cliff));
    uint256 releasedToken = token.balanceOf(address(this)).sub(unvestedToken);
    require(releasedToken > 0 && token.transfer(beneficiary, releasedToken));
    emit TokenReleased(beneficiary, releasedToken);
  }

  function revoke() public onlyOwner {
    require(token.transfer(msg.sender, token.balanceOf(address(this))));
    selfdestruct(msg.sender);
  }

  function _getMonthIndex() internal returns (uint256) {
    for (uint256 i = 0; i < eomTimestampsAfterCliff.length; ++i) {
      if (now < eomTimestampsAfterCliff[i]) {
        return i;
      }
    }
    return eomTimestampsAfterCliff.length;
  }
}
