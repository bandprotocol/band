pragma solidity 0.5.0;

import "./TrustedDataSource.sol";


contract TrustedDataSourceFactory {
  event TrustedDataSourceCreated(TrustedDataSource dataSource);

  function deploy(string calldata detail) external {
    TrustedDataSource dataSource = new TrustedDataSource(detail);
    dataSource.transferOwnership(msg.sender);
    emit TrustedDataSourceCreated(dataSource);
  }
}