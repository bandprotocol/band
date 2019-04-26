pragma solidity 0.5.0;

import "./token/ERC20Base.sol";


/**
 * @title BandToken
 *
 * @dev BandToken ERC-20 follows the ERC-20 standard. However, it adds token
 * locking functionality. Some addresses will have their tokens locked, which
 * means not all of their tokens are transferable. Locked tokens will reduce
 * monthly proportionally until they are fully unlocked.
 */
contract BandToken is ERC20Base("BandToken", "BAND", 18) {

  /**
   * @dev TokenLock struct represents the token locking information. This is
   * only relevant to Band investors that have token locking aggrements. It
   * consists of four fields. Note that the i^th month means the i^th month
   * since 2019/07, counting 2019/07   as the zeroth month.
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
  // the beginning of Q3 2019.
  uint256[48] private eomTimestamps;

  /**
   * @dev BandToken constructor. All of the available tokens are minted to the
   * token creator.
   */
  constructor(address creator) public {
    // Transfer ownership of BandToken from BandRegistry to original creator
    transferOwnership(creator);
    // Populate eomTimestamps for every month from the start of Q3 2019.
    // until the end of Q2 2023, for the total of 4 years (48 months).
    eomTimestamps[0] = 1564617600;  // End of 2019/07
    eomTimestamps[1] = 1567296000;  // End of 2019/08
    eomTimestamps[2] = 1569888000;  // End of 2019/09
    eomTimestamps[3] = 1572566400;  // End of 2019/10
    eomTimestamps[4] = 1575158400;  // End of 2019/11
    eomTimestamps[5] = 1577836800;  // End of 2019/12
    eomTimestamps[6] = 1580515200;  // End of 2020/01
    eomTimestamps[7] = 1583020800;  // End of 2020/02
    eomTimestamps[8] = 1585699200;  // End of 2020/03
    eomTimestamps[9] = 1588291200;  // End of 2020/04
    eomTimestamps[10] = 1590969600;  // End of 2020/05
    eomTimestamps[11] = 1593561600;  // End of 2020/06
    eomTimestamps[12] = 1596240000;  // End of 2020/07
    eomTimestamps[13] = 1598918400;  // End of 2020/08
    eomTimestamps[14] = 1601510400;  // End of 2020/09
    eomTimestamps[15] = 1604188800;  // End of 2020/10
    eomTimestamps[16] = 1606780800;  // End of 2020/11
    eomTimestamps[17] = 1609459200;  // End of 2020/12
    eomTimestamps[18] = 1612137600;  // End of 2021/01
    eomTimestamps[19] = 1614556800;  // End of 2021/02
    eomTimestamps[20] = 1617235200;  // End of 2021/03
    eomTimestamps[21] = 1619827200;  // End of 2021/04
    eomTimestamps[22] = 1622505600;  // End of 2021/05
    eomTimestamps[23] = 1625097600;  // End of 2021/06
    eomTimestamps[24] = 1627776000;  // End of 2021/07
    eomTimestamps[25] = 1630454400;  // End of 2021/08
    eomTimestamps[26] = 1633046400;  // End of 2021/09
    eomTimestamps[27] = 1635724800;  // End of 2021/10
    eomTimestamps[28] = 1638316800;  // End of 2021/11
    eomTimestamps[29] = 1640995200;  // End of 2021/12
    eomTimestamps[30] = 1643673600;  // End of 2022/01
    eomTimestamps[31] = 1646092800;  // End of 2022/02
    eomTimestamps[32] = 1648771200;  // End of 2022/03
    eomTimestamps[33] = 1651363200;  // End of 2022/04
    eomTimestamps[34] = 1654041600;  // End of 2022/05
    eomTimestamps[35] = 1656633600;  // End of 2022/06
    eomTimestamps[36] = 1659312000;  // End of 2022/07
    eomTimestamps[37] = 1661990400;  // End of 2022/08
    eomTimestamps[38] = 1664582400;  // End of 2022/09
    eomTimestamps[39] = 1667260800;  // End of 2022/10
    eomTimestamps[40] = 1669852800;  // End of 2022/11
    eomTimestamps[41] = 1672531200;  // End of 2022/12
    eomTimestamps[42] = 1675209600;  // End of 2023/01
    eomTimestamps[43] = 1677628800;  // End of 2023/02
    eomTimestamps[44] = 1680307200;  // End of 2023/03
    eomTimestamps[45] = 1682899200;  // End of 2023/04
    eomTimestamps[46] = 1685577600;  // End of 2023/05
    eomTimestamps[47] = 1688169600;  // End of 2023/06
  }

  /**
   * @dev Set locking period for the specified address. See TokenLockInfo above
   * for the descriptions of the function arguments.
   */
  function setTokenLock(
    address addr,
    uint8 start,
    uint8 cliff,
    uint8 end,
    uint256 value
  )
    public onlyOwner
    returns (bool)
  {
    require(start < cliff);
    require(cliff <= end);
    require(end > 0 && end <= 48);

    locked[addr] = TokenLockInfo({
      start: start,
      cliff: cliff,
      end: end,
      totalValue: value
    });

    return true;
  }

  /**
   * @dev Get the unlocked balance of the specified address.
   * @param addr The address to query
   * @return The unlocked balance, which is the total balance subtracted by
   * the number of tokens yet remained to be unlocked for this address. See
   * TokenLockInfo above for details.
   */
  function unlockedBalanceOf(address addr) public view returns (uint256) {
    TokenLockInfo storage lockInfo = locked[addr];
    uint256 totalBalance = balanceOf(addr);
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

  function transfer(address to, uint256 value) public returns (bool) {
    require(value <= unlockedBalanceOf(msg.sender));
    return super.transfer(to, value);
  }

  function transferAndCall(address sender, address to, uint256 value, bytes4 sig, bytes memory data)
    public
    returns (bool)
  {
    require(value <= unlockedBalanceOf(sender));
    return super.transferAndCall(sender, to, value, sig, data);
  }

  function transferFeeless(address sender, address to, uint256 value) public returns (bool) {
    require(value <= unlockedBalanceOf(sender));
    return super.transferFeeless(sender, to, value);
  }
}
