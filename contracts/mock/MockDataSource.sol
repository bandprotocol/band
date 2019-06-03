pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MockDataSource is Ownable {
  event DataPointSet(bytes32 indexed key, uint256 value);

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

  function get(bytes32 key) public view returns (uint256) {
    require(exists[key]);
    return values[key];
  }
}
