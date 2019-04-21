pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./DelegatedDataSource.sol";
import "../CommunityCore.sol";
import "../Parameters.sol";
import "../feeless/Feeless.sol";
import "../token/ERC20Acceptor.sol";
import "../token/ERC20Interface.sol";


contract StakeDelegatedDataSource is DelegatedDataSource, ERC20Acceptor, Feeless, Ownable {
  using SafeMath for uint256;

  event DataSourceRegistered(address indexed dataSource, address owner, uint256 stake);
  event DataSourceExited(address indexed dataSource, address owner, uint256 stake);
  event DataSourceVoted(address indexed dataSource, address indexed voter, uint256 stake, uint256 ownership);
  event DataSourceWithdrawn(address indexed dataSource, address indexed voter, uint256 withdraw);

  struct DataProvider {
    address owner;
    uint256 ownerStake;
    uint256 publicStake;
    uint256 totalPublicOwnership;
    mapping (address => uint256) publicOwnerships;
  }

  mapping (address => DataProvider) public providers;

  ERC20Interface public token;
  Parameters public params;
  DataProvider[] private dataProviders;

  constructor(CommunityCore core) public {
    token = core.commToken();
    params = core.params();
  }

  function getProviderPublicOwnership(address dataSource, address voter) 
    public view 
    returns (uint256)
  {
    return providers[dataSource].publicOwnerships[voter];
  }

  function getActiveDataSourceCount() public view returns (uint256) {
    return params.get("data:active_data_source_count");
  }

  function register(address owner, uint256 stake, address dataSource)
    public
    requireToken(token, owner, stake)
  {
    require(providers[dataSource].owner != address(0));
    require(stake > 0 && stake >= params.get("data:min_provider_stake"));
    providers[dataSource] = DataProvider({
      owner: owner,
      ownerStake: stake,
      publicStake: 0,
      totalPublicOwnership: 0
    });
    dataSources.push(dataSource);
    _repositionUp(dataSources.length.sub(1));
    emit DataSourceRegistered(dataSource, owner, stake);
  }

  function exit(address caller, address dataSource) public feeless(caller) {
    DataProvider storage provider = providers[dataSource];
    require(provider.owner != address(0));
    require(provider.owner == caller || provider.ownerStake < params.get("data:min_provider_stake"));
    address owner = provider.owner;
    uint256 ownerStake = provider.ownerStake;
    provider.owner = address(0);
    provider.ownerStake = 0;
    _repositionDown(_findDataSourceIndex(dataSource));
    dataSources.pop();
    require(token.transfer(owner, ownerStake));
    emit DataSourceExited(dataSource, owner, ownerStake);
  }

  function vote(address voter, uint256 stake, address dataSource)
    public
    requireToken(token, voter, stake)
  {
    DataProvider storage provider = providers[dataSource];
    require(stake > 0 && provider.publicOwnerships[voter] == 0);
    if (provider.totalPublicOwnership == 0) {
      provider.publicOwnerships[voter] = stake;
      provider.publicStake = provider.publicStake.add(stake);
      provider.totalPublicOwnership = stake;
    } else {
      uint256 newPublicStake = provider.publicStake.add(stake);
      uint256 newTotalPublicOwnership = newPublicStake.mul(provider.totalPublicOwnership).div(provider.publicStake);
      provider.publicOwnerships[voter] = newTotalPublicOwnership.sub(provider.totalPublicOwnership);
      provider.publicStake = newPublicStake;
      provider.totalPublicOwnership = newTotalPublicOwnership;
    }
    if (provider.owner != address(0)) {
      _repositionUp(_findDataSourceIndex(dataSource));
    }
    emit DataSourceVoted(dataSource, voter, stake, provider.publicOwnerships[voter]);
  }

  function withdraw(address voter, address dataSource) public feeless(voter) {
    DataProvider storage provider = providers[dataSource];
    uint256 voterOwnership = provider.publicOwnerships[voter];
    require(voterOwnership > 0);
    uint256 newOwnership = provider.totalPublicOwnership.sub(voterOwnership);
    uint256 newPublicStake = provider.publicStake.mul(newOwnership).div(provider.totalPublicOwnership);
    uint256 withdrawAmount = provider.publicStake.sub(newPublicStake);
    provider.publicStake = newPublicStake;
    provider.totalPublicOwnership = newOwnership;
    provider.publicOwnerships[voter] = 0;
    if (provider.owner != address(0)) {
      _repositionDown(_findDataSourceIndex(dataSource));
    }
    require(token.transfer(voter, withdrawAmount));
    emit DataSourceWithdrawn(dataSource, voter, withdrawAmount);
  }

  ////////////////////////////////////////////////////////////
  function _repositionUp(uint256 dataSourceIndex) internal {
    bool changed = false;
    for (; dataSourceIndex > 0; --dataSourceIndex) {
      if (_isLhsBetterThanRhs(dataSourceIndex, dataSourceIndex - 1)) {
        _swapDataSource(dataSourceIndex, dataSourceIndex - 1);
        changed = true;
      } else {
        break;
      }
    }
    if (changed) emit DelegatedDataSourcesChanged();
  }

  function _repositionDown(uint256 dataSourceIndex) internal {
    bool changed = false;
    uint256 lastDataSourceIndex = dataSources.length.sub(1);
    for (; dataSourceIndex < lastDataSourceIndex; --dataSourceIndex) {
      if (_isLhsBetterThanRhs(dataSourceIndex + 1, dataSourceIndex)) {
        _swapDataSource(dataSourceIndex + 1, dataSourceIndex);
        changed = true;
      } else {
        break;
      }
    }
    if (changed) emit DelegatedDataSourcesChanged();
  }

  function _findDataSourceIndex(address dataSource) 
    internal view 
    returns (uint256) 
  {
    for (uint256 index = 0; index < dataSources.length; ++index) {
      if (dataSources[index] == dataSource) return index;
    }
    assert(false);
  }

  function _isLhsBetterThanRhs(uint256 left, uint256 right) 
    internal view 
    returns (bool) 
  {
    DataProvider storage leftProvider = providers[dataSources[left]];
    DataProvider storage rightProvider = providers[dataSources[right]];
    if (leftProvider.owner == address(0)) return false;
    if (rightProvider.owner == address(0)) return true;
    return (
      leftProvider.ownerStake.add(leftProvider.publicStake) >=
      rightProvider.ownerStake.add(rightProvider.publicStake)
    );
  }

  function _swapDataSource(uint256 left, uint256 right) internal {
    address temp = dataSources[left];
    dataSources[left] = dataSources[right];
    dataSources[right] = temp;
  }
}
