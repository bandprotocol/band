pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "../utils/ArrayUtils.sol";


/**
 * @dev Base implementation of delegated data source. Support aggregation of data from multiple
 * underlying sources. Concrete implementation must fill "dataSources" with source addresses.
 */
contract DelegatedDataSource {
  using SafeMath for uint256;

  address[] internal dataSources;
  event DelegatedDataSourcesChanged();

  function getActiveDataSourceCount() public view returns (uint256) {
    return dataSources.length;
  }

  function getAllDataSourceCount() public view returns (uint256) {
    return dataSources.length;
  }

  function getNthDataSource(uint256 index) public view returns (address) {
    // require(msg.sender == address(0));  // Only off-chain calls allowed.
    return dataSources[index];
  }

  function getAsNumber(bytes32 key) public payable returns (uint256) {
    return ArrayUtils.getMedian(_loadDataAt(key));
  }

  function getAsBytes32(bytes32 key) public payable returns (bytes32) {
    return bytes32(ArrayUtils.getMajority(_loadDataAt(key)));
  }

  function getAsBool(bytes32 key) public payable returns (bool) {
    return ArrayUtils.getMajority(_loadDataAt(key)) != 0;
  }

  ////////////////////////////////////////////////////////////
  function _loadDataAt(bytes32 key) internal returns (uint256[] memory) {
    uint256[] memory rawdata = new uint256[](dataSources.length);
    uint256 rawdataLength = 0;
    uint256 activeDataSourceCount = Math.min(getActiveDataSourceCount(), dataSources.length);
    for (uint256 index = 0; index < activeDataSourceCount; ++index) {
      address source = dataSources[index];
      (bool ok, bytes memory ret) = source.call(abi.encodeWithSignature("get(bytes32)", key));
      if (!ok || ret.length < 32) continue;
      // TODO: Distribute rewards to provider
      uint256 value;
      assembly { value := mload(add(ret, 0x20)) }
      rawdata[rawdataLength++] = value;
    }
    require(rawdataLength > 0);
    uint256[] memory data = new uint256[](rawdataLength);
    for (uint256 index = 0; index < rawdataLength; ++index) {
      data[index] = rawdata[index];
    }
    return data;
  }
}
