pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "./DelegatedDataSource.sol";
import "../CommunityCore.sol";
import "../ParametersBase.sol";
import "../feeless/Feeless.sol";
import "../utils/Fractional.sol";
import "../token/ERC20Acceptor.sol";
import "../token/ERC20Interface.sol";

contract StakeDelegatedDataSource is DelegatedDataSource, ERC20Acceptor, Feeless, Ownable {
  using Fractional for uint256;
  using SafeMath for uint256;

  event DataSourceRegistered(address indexed dataSource, address owner);
  event DataSourceRemoved(address indexed dataSource);
  event DataSourceStakeChanged(address indexed dataSource, uint256 newStake);
  event DataSourceOwnershipChanged(address indexed dataSource, address indexed voter, uint256 newVoterOwnership, uint256 newTotalOwnership);

  enum DataProviderStatus{
    Nothing,
    Active,
    Removed
  }

  struct DataProvider {
    DataProviderStatus currentStatus;
    address owner;
    uint256 stake;
    uint256 totalPublicOwnership;
    mapping (address => uint256) publicOwnerships;
  }

  mapping (address => DataProvider) public providers;

  ERC20Interface public token;
  ParametersBase public params;
  CommunityCore public core;

  uint256 public undistributedReward;


  constructor(CommunityCore _core) public {
    token = _core.commToken();
    params = _core.params();
    core = _core;
  }

  function getProviderPublicOwnership(address dataSource, address voter)
    public view
    returns (uint256)
  {
    return providers[dataSource].publicOwnerships[voter];
  }

  function getStakeInProvider(address dataSource, address voter)
    public view
    returns (uint256)
  {
    DataProvider storage provider = providers[dataSource];
    if (provider.totalPublicOwnership == 0)
      return 0;
    return provider.publicOwnerships[voter].mul(provider.stake).div(provider.totalPublicOwnership);
  }

  function getActiveDataSourceCount() public view returns (uint256) {
    return Math.min(dataSources.length, params.get("data:active_data_source_count"));
  }

  function getQueryPrice() public view returns (uint256) {
    return params.get("data:query_price");
  }

  function register(address owner, uint256 stake, address dataSource)
    public
    requireToken(token, owner, stake)
  {
    require(providers[dataSource].currentStatus == DataProviderStatus.Nothing);
    require(stake > 0 && stake >= params.get("data:min_provider_stake"));
    providers[dataSource] = DataProvider({
      currentStatus: DataProviderStatus.Active,
      owner: owner,
      stake: stake,
      totalPublicOwnership: stake
    });
    providers[dataSource].publicOwnerships[owner] = stake;
    dataSources.push(dataSource);
    emit DataSourceRegistered(dataSource, owner);
    emit DataSourceStakeChanged(dataSource, stake);
    emit DataSourceOwnershipChanged(dataSource, owner, stake, stake);
    _repositionUp(dataSources.length.sub(1));
  }

  function vote(address voter, uint256 stake, address dataSource)
    public
    requireToken(token, voter, stake)
  {
    _vote(voter, stake, dataSource);
    DataProvider storage provider = providers[dataSource];
    emit DataSourceStakeChanged(dataSource, provider.stake);
    _repositionUp(_findDataSourceIndex(dataSource));
  }

  function withdraw(address voter, uint256 withdrawOwnership, address dataSource) public feeless(voter) {
    DataProvider storage provider = providers[dataSource];
    require(withdrawOwnership > 0 && withdrawOwnership <= provider.publicOwnerships[voter]);
    uint256 newOwnership = provider.totalPublicOwnership.sub(withdrawOwnership);
    uint256 newStake = provider.stake.mul(newOwnership).div(provider.totalPublicOwnership);
    uint256 withdrawAmount = provider.stake.sub(newStake);
    uint256 newVoterOwnership = provider.publicOwnerships[voter].sub(withdrawOwnership);
    provider.stake = newStake;
    provider.totalPublicOwnership = newOwnership;
    provider.publicOwnerships[voter] = newVoterOwnership;
    require(token.transfer(voter, withdrawAmount));

    emit DataSourceStakeChanged(dataSource, newStake);
    emit DataSourceOwnershipChanged(dataSource, voter, newVoterOwnership, newOwnership);
    if (provider.currentStatus == DataProviderStatus.Active) {
      _repositionDown(_findDataSourceIndex(dataSource));
    }

    if (provider.owner == voter && 
        getStakeInProvider(dataSource, provider.owner) < params.get("data:min_provider_stake") &&
        provider.currentStatus == DataProviderStatus.Active) {
      kick(dataSource);
    }
  }

  function kick(address dataSource) public {
    DataProvider storage provider = providers[dataSource];
    require(provider.currentStatus == DataProviderStatus.Active);
    address owner = provider.owner;
    uint256 ownerOwnership = provider.publicOwnerships[owner];
    require(getStakeInProvider(dataSource, owner) < params.get("data:min_provider_stake"));
    provider.currentStatus = DataProviderStatus.Removed;
    emit DataSourceRemoved(dataSource);
    _repositionDown(_findDataSourceIndex(dataSource));
    dataSources.pop();
  }

  ////////////////////////////////////////////////////////////
  function distributeFee() public {
    require(address(this).balance > 0);
    // TODO: Convert eth in this contract to community token
    undistributedReward = undistributedReward.add(core.convertEthToToken.value(address(this).balance)());
    uint256 totalProviderCount = getActiveDataSourceCount();
    uint256 providerReward = undistributedReward.div(totalProviderCount);
    uint256 ownerPercentage = params.get("data:owner_percentage");
    uint256 ownerReward = ownerPercentage.multipliedBy(providerReward);
    uint256 stakeIncreased = providerReward.sub(ownerReward);
    for(uint256 dataSourceIndex = 0; dataSourceIndex < totalProviderCount; ++dataSourceIndex) {
      DataProvider storage provider = providers[dataSources[dataSourceIndex]];
      provider.stake = provider.stake.add(stakeIncreased);
      _vote(provider.owner, ownerReward, dataSources[dataSourceIndex]);
      undistributedReward = undistributedReward.sub(providerReward);
      emit DataSourceStakeChanged(dataSources[dataSourceIndex], provider.stake);
    }
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
    for (; dataSourceIndex < lastDataSourceIndex; ++dataSourceIndex) {
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
    if (leftProvider.currentStatus != DataProviderStatus.Active) return false;
    if (rightProvider.currentStatus != DataProviderStatus.Active) return true;
    return leftProvider.stake >= rightProvider.stake;
  }

  function _swapDataSource(uint256 left, uint256 right) internal {
    address temp = dataSources[left];
    dataSources[left] = dataSources[right];
    dataSources[right] = temp;
  }

  function _vote(address voter, uint256 stake, address dataSource) internal {
    DataProvider storage provider = providers[dataSource];
    require(stake > 0 && provider.currentStatus == DataProviderStatus.Active && provider.totalPublicOwnership != 0);
    uint256 newStake = provider.stake.add(stake);
    uint256 newTotalPublicOwnership = newStake.mul(provider.totalPublicOwnership).div(provider.stake);
    uint256 newVoterPublicOwnership = provider.publicOwnerships[voter].add(newTotalPublicOwnership.sub(provider.totalPublicOwnership));
    provider.publicOwnerships[voter] = newVoterPublicOwnership;
    provider.stake = newStake;
    provider.totalPublicOwnership = newTotalPublicOwnership;
    
    emit DataSourceOwnershipChanged(dataSource, voter, newVoterPublicOwnership, newTotalPublicOwnership);
  }
}
