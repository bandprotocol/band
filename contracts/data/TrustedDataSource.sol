pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @dev TrustedDataSource allows the contract's owner to store key-value pairs into 
 * the contract. The value can be read for external parities using "get" function.
 */
contract TrustedDataSource is Ownable {
  event DataPointSet(bytes32 indexed key, uint256 value);
  event DataPointCleared(bytes32 indexed key);

  mapping (bytes32 => bool) public exists;
  mapping (bytes32 => uint256) public values;
  string public detail;

  constructor(string memory _detail) public {
    detail = _detail;
  }

  function setNumber(bytes32 key, uint256 value) public onlyOwner {
    exists[key] = true;
    values[key] = value;
    emit DataPointSet(key, value);
  }

  function setBytes32(bytes32 key, bytes32 value) public onlyOwner {
    exists[key] = true;
    values[key] = uint256(value);
    emit DataPointSet(key, uint256(value));
  }

  function clear(bytes32 key) public onlyOwner {
    exists[key] = false;
    values[key] = 0;
    emit DataPointCleared(key);
  }

  function get(bytes32 key) public view returns (uint256) {
    require(exists[key]);
    return values[key];
  }
}
