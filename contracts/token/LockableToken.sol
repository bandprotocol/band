pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/roles/CapperRole.sol";
import "./ERC20Base.sol";

contract LockableToken is ERC20Base, CapperRole {
  using SafeMath for uint256;

  mapping (address => uint256) public locks;

  function unlockedBalanceOf(address owner) public view returns (uint256) {
    return balanceOf(owner).sub(locks[owner]);
  }

  function lock(address owner, uint256 amount) public onlyCapper returns (bool) {
    require(balanceOf(owner) >= locks[owner].add(amount));
    locks[owner] = locks[owner].add(amount);
    return true;
  }

  function unlock(address owner, uint256 amount) public onlyCapper returns (bool) {
    require(locks[owner] >= amount);
    locks[owner] = locks[owner].sub(amount);
    return true;
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
