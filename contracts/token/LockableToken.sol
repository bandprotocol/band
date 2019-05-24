pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/access/roles/CapperRole.sol";
import "./ERC20Base.sol";

contract LockableToken is ERC20Base, CapperRole {
  using SafeMath for uint256;

  event TokenLocked(address indexed locker, address indexed owner, uint256 value);
  event TokenUnlocked(address indexed locker, address indexed owner, uint256 value);

  uint256 constant NOT_FOUND = uint256(- 1);

  struct TokenLock {
    address locker;
    uint256 value;
  }

  mapping (address => TokenLock[]) _locks;

  function getLockedToken(address owner) public view returns (uint256) {
    TokenLock[] storage locks = _locks[owner];
    uint256 maxLock = 0;
    for (uint256 i = 0; i < locks.length; ++i) {
      maxLock = Math.max(maxLock, locks[i].value);
    }
    return maxLock;
  }

  function getLockedTokenAt(address owner, address locker) public view returns (uint256) {
    uint256 index = _getTokenLockIndex(owner, locker);
    if (index != NOT_FOUND) return _locks[owner][index].value;
    else return 0;
  }

  function unlockedBalanceOf(address owner) public view returns (uint256) {
    return balanceOf(owner).sub(getLockedToken(owner));
  }

  function lock(address owner, uint256 value) public onlyCapper returns (bool) {
    uint256 index = _getTokenLockIndex(owner, msg.sender);
    if (index != NOT_FOUND) {
      uint256 currentLock = _locks[owner][index].value;
      require(balanceOf(owner) >= currentLock.add(value));
      _locks[owner][index].value = currentLock.add(value);
    } else {
      require(balanceOf(owner) >= value);
      _locks[owner].push(TokenLock(msg.sender, value));
    }
    emit TokenLocked(msg.sender, owner, value);
    return true;
  }

  function unlock(address owner, uint256 value) public onlyCapper returns (bool) {
    uint256 index = _getTokenLockIndex(owner, msg.sender);
    require(index != NOT_FOUND);
    TokenLock[] storage locks = _locks[owner];
    require(locks[index].value >= value);
    locks[index].value = locks[index].value.sub(value);
    if (locks[index].value == 0) {
      if (index != locks.length - 1) {
        locks[index] = locks[locks.length - 1];
      }
      locks.pop();
    }
    emit TokenUnlocked(msg.sender, owner, value);
    return true;
  }

  function _getTokenLockIndex(address owner, address locker) internal view returns (uint256) {
    TokenLock[] storage locks = _locks[owner];
    for (uint256 i = 0; i < locks.length; ++i) {
      if (locks[i].locker == locker) {
        return i;
      }
    }
    return NOT_FOUND;
  }

  function _transfer(address from, address to, uint256 value) internal {
    require(unlockedBalanceOf(from) >= value);
    super._transfer(from, to, value);
  }

  function _burn(address account, uint256 value) internal {
    require(unlockedBalanceOf(account) >= value);
    super._burn(account, value);
  }
}
