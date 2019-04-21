pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./DelegatedDataSource.sol";


/**
 * @dev Simple implementation of delegated data source that allows the contract creator
 * to fully control the list of data providers.
 */
contract SimpleDelegatedDataSource is DelegatedDataSource, Ownable {

  function addDataSource(address dataSource) public onlyOwner {
    dataSources.push(dataSource);
    emit DelegatedDataSourcesChanged();
  }
}
