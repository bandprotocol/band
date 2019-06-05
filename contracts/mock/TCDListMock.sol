pragma solidity 0.5.8;

import "../data/TCDBase.sol";

contract TCDListMock is TCDBase {
  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public TCDBase(_prefix, _bondingCurve, _params, _registry) {}

  function setValue(address dataSource, uint256 value) public {
    providers[dataSource].stake = value;
  }

  function addToList(address dataSource, address _prevDataSource) public {
    _addDataSourceToList(dataSource, _prevDataSource);
  }

  function removeFromList(address dataSource, address _prevDataSource) public {
    _removeDataSourceFromList(dataSource, _prevDataSource);
  }

  function findPrevDataSource(address dataSource) public view returns (address) {
    return _findPrevDataSourceAddress(dataSource);
  }
}
