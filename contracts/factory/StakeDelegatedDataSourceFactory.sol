pragma solidity 0.5.0;

import "../CommunityCore.sol";
import "../data/StakeDelegatedDataSource.sol";

contract StakeDelegatedDataSourceFactory {
    event StakeDelegatedDataSourceCreated(address delegatedDataSource, address core);

    function create(CommunityCore core) external {
        StakeDelegatedDataSource delegatedDataSource = new StakeDelegatedDataSource(core);
        emit StakeDelegatedDataSourceCreated(address(delegatedDataSource), address(core));
    }
}