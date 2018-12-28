pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


/**
 * @title BandToken
 *
 * @dev BandToken ERC-20 follows the ERC-20 standard. However, it adds token
 * locking functionality. Some addresses will have their tokens locked, which
 * means not all of their tokens are transferable. Locked tokens will reduce
 * monthly proportionally until they are fully unlocked.
 */
contract BandToken is ERC20, Ownable {

  string public constant name = "BandToken";
  string public constant symbol = "BAND";
  uint256 public constant decimals = 18;

  /**
   * @dev TokenLock struct represents the token locking information. This is
   * only relevant to Band investors that have token locking aggrements. It
   * consists of four fields. Note that the i^th month, mean the i^th month
   * since 2019/04, counting 2019/04 as the zeroth month.
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
  // the beginning of Q2 2019.
  uint256[48] private eomTimestamps;

  /**
   * @dev BandToken constructor. All of the available tokens are minted to the
   * token creator.
   */
  constructor(uint256 totalSupply) public {
    // Initially, all of the minted tokens belong to the contract creator.
    _mint(msg.sender, totalSupply);

    // Populate eomTimestamps for every month from the start of Q2 2019.
    // until the end of Q1 2023, for the total of 4 years (48 months).
    eomTimestamps[0] = 1556668800;   // End of 2019/04
    eomTimestamps[1] = 1559347200;   // End of 2019/05
    eomTimestamps[2] = 1561939200;   // End of 2019/06
    eomTimestamps[3] = 1564617600;   // End of 2019/07
    eomTimestamps[4] = 1567296000;   // End of 2019/08
    eomTimestamps[5] = 1569888000;   // End of 2019/09
    eomTimestamps[6] = 1572566400;   // End of 2019/10
    eomTimestamps[7] = 1575158400;   // End of 2019/11
    eomTimestamps[8] = 1577836800;   // End of 2020/00
    eomTimestamps[9] = 1580515200;   // End of 2020/01
    eomTimestamps[10] = 1583020800;  // End of 2020/02
    eomTimestamps[11] = 1585699200;  // End of 2020/03
    eomTimestamps[12] = 1588291200;  // End of 2020/04
    eomTimestamps[13] = 1590969600;  // End of 2020/05
    eomTimestamps[14] = 1593561600;  // End of 2020/06
    eomTimestamps[15] = 1596240000;  // End of 2020/07
    eomTimestamps[16] = 1598918400;  // End of 2020/08
    eomTimestamps[17] = 1601510400;  // End of 2020/09
    eomTimestamps[18] = 1604188800;  // End of 2020/10
    eomTimestamps[19] = 1606780800;  // End of 2020/11
    eomTimestamps[20] = 1609459200;  // End of 2021/00
    eomTimestamps[21] = 1612137600;  // End of 2021/01
    eomTimestamps[22] = 1614556800;  // End of 2021/02
    eomTimestamps[23] = 1617235200;  // End of 2021/03
    eomTimestamps[24] = 1619827200;  // End of 2021/04
    eomTimestamps[25] = 1622505600;  // End of 2021/05
    eomTimestamps[26] = 1625097600;  // End of 2021/06
    eomTimestamps[27] = 1627776000;  // End of 2021/07
    eomTimestamps[28] = 1630454400;  // End of 2021/08
    eomTimestamps[29] = 1633046400;  // End of 2021/09
    eomTimestamps[30] = 1635724800;  // End of 2021/10
    eomTimestamps[31] = 1638316800;  // End of 2021/11
    eomTimestamps[32] = 1640995200;  // End of 2022/00
    eomTimestamps[33] = 1643673600;  // End of 2022/01
    eomTimestamps[34] = 1646092800;  // End of 2022/02
    eomTimestamps[35] = 1648771200;  // End of 2022/03
    eomTimestamps[36] = 1651363200;  // End of 2022/04
    eomTimestamps[37] = 1654041600;  // End of 2022/05
    eomTimestamps[38] = 1656633600;  // End of 2022/06
    eomTimestamps[39] = 1659312000;  // End of 2022/07
    eomTimestamps[40] = 1661990400;  // End of 2022/08
    eomTimestamps[41] = 1664582400;  // End of 2022/09
    eomTimestamps[42] = 1667260800;  // End of 2022/10
    eomTimestamps[43] = 1669852800;  // End of 2022/11
    eomTimestamps[44] = 1672531200;  // End of 2023/00
    eomTimestamps[45] = 1675209600;  // End of 2023/01
    eomTimestamps[46] = 1677628800;  // End of 2023/02
    eomTimestamps[47] = 1680307200;  // End of 2023/03
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
    public
    onlyOwner
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

  /**
   * @dev Similar to ERC20 transfer, with extra token locking restriction.
   */
  function transfer(address to, uint256 value) public returns (bool) {
    require(value <= unlockedBalanceOf(msg.sender));
    return super.transfer(to, value);
  }

  /**
  * @dev Transfer tokens and call the reciver's given function with supplied
  * data, using ERC165 to determine interoperability.
  */
  function transferAndCall(
    address to,
    uint256 value,
    bytes4 sig,
    bytes calldata data
  )
    external
    returns (bool)
  {
    require(value <= unlockedBalanceOf(msg.sender));
    super.transfer(to, value);
    require(ERC165Checker._supportsInterface(to, sig));
    (bool success,) = to.call(abi.encodePacked(sig, uint256(msg.sender), value, data));
    require(success);
    return true;
  }

  /**
   * @dev Similar to ERC20 transferFrom, with extra token locking restriction.
   */
  function transferFrom(address from, address to, uint256 value)
    public
    returns (bool)
  {
    require(value <= unlockedBalanceOf(from));
    return super.transferFrom(from, to, value);
  }
}
