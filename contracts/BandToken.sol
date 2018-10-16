pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


/**
 * @title BandToken
 *
 * @dev BandToken ERC-20 follows the ERC-20 standard. However, it adds token
 * locking functionality. Some addresses will have their tokens locked, which
 * means not all of their tokens are transferable. Locked tokens will reduce
 * monthly proportionally until they are fully unlocked.
 */
contract BandToken is StandardToken, Ownable {

  string public constant name = "BandToken";
  string public constant symbol = "BAND";
  uint256 public constant decimals = 18;

  /**
   * @dev TokenLock struct represents the token locking information. This is
   * only relevant to Band investors that have token locking aggrements. It
   * consists of four fields. Note that the i^th month, mean the i^th month
   * since 2019/01, counting 2019/01 as the zeroth month.
   *
   * start: token locking starts at the beginning of the start^th month.
   * cliff: at the beginning of the cliff^th month, the amount of locked tokens
   *        will be propotional to the number of full months since start and
   *        the total of months between start and end.
   * end: at the beginning of the end^th month, all of the tokens are unlocked.
   * totalValue: the total amount of tokens that the locking has control over.
   */
  struct TokenLockInfo {
    uint8 start;
    uint8 cliff;
    uint8 end;
    uint256 totalValue;
  }

  mapping (address => TokenLockInfo) public locked;

  // Array of epoch timestamps generated in constructor. The i^th index
  // represents the end of the i^th month after Band mainnet launch, which is
  // the beginning of 2019.
  uint256[48] private eomTimestamps;

  /**
   * @dev BandToken constructor. All of the available tokens are minted to the
   * token creator.
   */
  constructor(uint256 _totalSupply) public {
    // Initially, all of the minted tokens belong to the contract creator.
    balances[msg.sender] = _totalSupply;
    totalSupply_ = _totalSupply;

    // Populate eomTimestamps for every month from the end of 2018/01
    // until the end of 2021/12, for the total of 4 years (48 months).
    eomTimestamps[ 0] = 1517443200;  // End of 2018/01
    eomTimestamps[ 1] = 1519862400;  // End of 2018/02
    eomTimestamps[ 2] = 1522540800;  // End of 2018/03
    eomTimestamps[ 3] = 1525132800;  // End of 2018/04
    eomTimestamps[ 4] = 1527811200;  // End of 2018/05
    eomTimestamps[ 5] = 1530403200;  // End of 2018/06
    eomTimestamps[ 6] = 1533081600;  // End of 2018/07
    eomTimestamps[ 7] = 1535760000;  // End of 2018/08
    eomTimestamps[ 8] = 1538352000;  // End of 2018/09
    eomTimestamps[ 9] = 1541030400;  // End of 2018/10
    eomTimestamps[10] = 1543622400;  // End of 2018/11
    eomTimestamps[11] = 1546300800;  // End of 2018/12
    eomTimestamps[12] = 1548979200;  // End of 2019/01
    eomTimestamps[13] = 1551398400;  // End of 2019/02
    eomTimestamps[14] = 1554076800;  // End of 2019/03
    eomTimestamps[15] = 1556668800;  // End of 2019/04
    eomTimestamps[16] = 1559347200;  // End of 2019/05
    eomTimestamps[17] = 1561939200;  // End of 2019/06
    eomTimestamps[18] = 1564617600;  // End of 2019/07
    eomTimestamps[19] = 1567296000;  // End of 2019/08
    eomTimestamps[20] = 1569888000;  // End of 2019/09
    eomTimestamps[21] = 1572566400;  // End of 2019/10
    eomTimestamps[22] = 1575158400;  // End of 2019/11
    eomTimestamps[23] = 1577836800;  // End of 2019/12
    eomTimestamps[24] = 1580515200;  // End of 2020/01
    eomTimestamps[25] = 1583020800;  // End of 2020/02
    eomTimestamps[26] = 1585699200;  // End of 2020/03
    eomTimestamps[27] = 1588291200;  // End of 2020/04
    eomTimestamps[28] = 1590969600;  // End of 2020/05
    eomTimestamps[29] = 1593561600;  // End of 2020/06
    eomTimestamps[30] = 1596240000;  // End of 2020/07
    eomTimestamps[31] = 1598918400;  // End of 2020/08
    eomTimestamps[32] = 1601510400;  // End of 2020/09
    eomTimestamps[33] = 1604188800;  // End of 2020/10
    eomTimestamps[34] = 1606780800;  // End of 2020/11
    eomTimestamps[35] = 1609459200;  // End of 2020/12
    eomTimestamps[36] = 1612137600;  // End of 2021/01
    eomTimestamps[37] = 1614556800;  // End of 2021/02
    eomTimestamps[38] = 1617235200;  // End of 2021/03
    eomTimestamps[39] = 1619827200;  // End of 2021/04
    eomTimestamps[40] = 1622505600;  // End of 2021/05
    eomTimestamps[41] = 1625097600;  // End of 2021/06
    eomTimestamps[42] = 1627776000;  // End of 2021/07
    eomTimestamps[43] = 1630454400;  // End of 2021/08
    eomTimestamps[44] = 1633046400;  // End of 2021/09
    eomTimestamps[45] = 1635724800;  // End of 2021/10
    eomTimestamps[46] = 1638316800;  // End of 2021/11
    eomTimestamps[47] = 1638316800;  // End of 2021/12
  }

  /**
   * @dev Set locking period for the specified address. See TokenLockInfo above
   * for the descriptions of the function arguments.
   */
  function setTokenLock(
    address _addr,
    uint8 _start,
    uint8 _cliff,
    uint8 _end,
    uint256 _value
  )
    public
    onlyOwner
    returns (bool)
  {
    require (_start < _cliff);
    require (_cliff <= _end);
    require (_end > 0 && _end <= 48);

    locked[_addr] = TokenLockInfo({
      start: _start,
      cliff: _cliff,
      end: _end,
      totalValue: _value
    });

    return true;
  }

  /**
   * @dev Get the unlocked balance of the specified address.
   * @param _addr The address to query
   * @return The unlocked balance, which is the total balance subtracted by
   * the number of tokens yet remained to be unlocked for this address. See
   * TokenLockInfo above for details.
   */
  function unlockedBalanceOf(address _addr) public view returns (uint256) {
    TokenLockInfo storage lockInfo = locked[_addr];

    uint256 totalBalance = balances[_addr];
    uint8 end = lockInfo.end;

    if (end == 0) {
      // Most of the time, the address will not have token locking logic.
      // We can simply return totalBalance in this case.
      return totalBalance;
    }

    // Calculate the current month using a simple loop. The array size is
    // limitted to 48, so the gas cost here is bounded to approximately 10k.
    uint8 currentMonth = 0;

    while (currentMonth < end && eomTimestamps[currentMonth] <= now) {
      // Loop one-by-one until we find the first month that ends after the
      // current time.
      currentMonth = currentMonth + 1;
    }

    uint8 start = lockInfo.start;
    uint8 cliff = lockInfo.cliff;
    uint256 totalLocked = lockInfo.totalValue;

    // This variable will be initialized in one of the three conditions below.
    // It will indicate the effective amount of locked tokens at this moment.
    uint256 currentlyLocked = 0;

    if (currentMonth < cliff) {
      // The cliff has not passed yet. All of the tokens are locked.
      currentlyLocked = totalLocked;
    } else if (currentMonth < end) {
      // Some of the tokens are locked proportionally to the remaining time.
      uint256 totalMonths = uint256(end - start);
      uint256 remainingMonths = uint256(end - currentMonth);
      currentlyLocked = totalLocked.mul(remainingMonths).div(totalMonths);
    } else {
      // The duration has passed. None of the tokens are locked.
      currentlyLocked = 0;
    }

    if (currentlyLocked > totalBalance) {
      return 0;
    } else {
      return totalBalance.sub(currentlyLocked);
    }
  }

  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_value <= unlockedBalanceOf(msg.sender));
    return super.transfer(_to, _value);
  }

  function transferFrom(address _from, address _to, uint256 _value)
    public
    returns (bool)
  {
    require(_value <= unlockedBalanceOf(_from));
    return super.transferFrom(_from, _to, _value);
  }
}
