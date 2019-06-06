pragma solidity 0.5.9;

import "../data/TCDBase.sol";

contract TCDListMock is TCDBase {
  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function setValue(address dataSource, uint256 value) public {
    infoMap[dataSource].stake = value;
  }

  function addToList(address dataSource, address _prevDataSource) public {
    _addDataSource(dataSource, _prevDataSource);
  }

  function removeFromList(address dataSource, address _prevDataSource) public {
    _removeDataSource(dataSource, _prevDataSource);
  }

  function findPrevDataSource(address dataSource) public view returns (address) {
    return _findPrevDataSource(dataSource);
  }
}
