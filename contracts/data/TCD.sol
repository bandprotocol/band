pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
import "./TCDBase.sol";
import "../BandToken.sol";
import "../CommunityToken.sol";
import "../Parameters.sol";
import "../exchange/BondingCurve.sol";
import "../exchange/BandExchangeInterface.sol";
import "../feeless/Feeless.sol";
import "../utils/Fractional.sol";

contract TCD is TCDBase, Feeless {
  using Fractional for uint256;
  using SafeMath for uint256;

  event DataSourceRegistered(address indexed dataSource, address owner);
  event DataSourceRemoved(address indexed dataSource);
  event DataSourceStakeChanged(address indexed dataSource, uint256 newStake);
  event DataSourceVoterTokenLockChanged(address indexed dataSource, address indexed voter, uint256 newtokenLock);
  event DataSourceOwnershipChanged(address indexed dataSource, address indexed voter, uint256 newVoterOwnership, uint256 newTotalOwnership);
  event OwnerWithdrawReceiptCreated(uint256 receiptIndex, address indexed owner, uint256 amount, uint64 withdrawTime);
  event OwnerWithdrawReceiptUnlocked(uint256 receiptIndex, address indexed owner, uint256 amount);

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
    mapping (address => uint256) tokenLocks;
    mapping (address => uint256) publicOwnerships;
  }

  struct ProviderWithdrawReceipt {
    address owner;
    uint256 amount;
    uint64 withdrawTime;
    bool isWithdrawn;
  }

  ProviderWithdrawReceipt[] public withdrawReceipts;

  mapping (address => DataProvider) public providers;
  BandToken public band;
  CommunityToken public token;
  Parameters public params;
  BandExchangeInterface public exchange;
  BondingCurve public bondingCurve;
  uint256 public undistributedReward;
  bytes8 public prefix;

  constructor(
    bytes8 _prefix,
    BandToken _band,
    CommunityToken _token,
    Parameters _params,
    BondingCurve _bondingCurve,
    BandExchangeInterface _exchange
  ) public {
    prefix = _prefix;
    band = _band;
    token = _token;
    params = _params;
    bondingCurve = _bondingCurve;
    exchange = _exchange;
    band.approve(address(_bondingCurve), 2 ** 256 - 1);
    setExecDelegator(token.execDelegator());
  }

  function getProviderPublicOwnership(address dataSource, address voter)  public view returns (uint256) {
    return providers[dataSource].publicOwnerships[voter];
  }

  function getStakeInProvider(address dataSource, address voter) public view returns (uint256) {
    DataProvider storage provider = providers[dataSource];
    if (provider.totalPublicOwnership == 0)
      return 0;
    return provider.publicOwnerships[voter].mul(provider.stake).div(provider.totalPublicOwnership);
  }

  function getActiveDataSourceCount() public view returns (uint256) {
    return Math.min(dataSources.length, params.get(prefix, "max_provider_count"));
  }

  function getQueryPrice() public view returns (uint256) {
    return params.get(prefix, "query_price");
  }

  function getOwnerDelayWithdrawTime() public view returns (uint256) {
    return params.get(prefix, "withdraw_delay");
  }

  function register(address owner, uint256 stake, address dataSource) public feeless(owner) {
    require(token.lock(owner, stake));
    require(providers[dataSource].currentStatus == DataProviderStatus.Nothing);
    require(stake > 0 && stake >= params.get(prefix, "min_provider_stake"));
    providers[dataSource] = DataProvider({
      currentStatus: DataProviderStatus.Active,
      owner: owner,
      stake: stake,
      totalPublicOwnership: stake
    });
    providers[dataSource].publicOwnerships[owner] = stake;
    providers[dataSource].tokenLocks[owner] = stake;
    dataSources.push(dataSource);
    emit DataSourceRegistered(dataSource, owner);
    emit DataSourceOwnershipChanged(dataSource, owner, stake, stake);
    emit DataSourceStakeChanged(dataSource, stake);
    emit DataSourceVoterTokenLockChanged(dataSource, owner, stake);
    _repositionUp(dataSources.length.sub(1));
  }

  function vote(address voter, uint256 stake, address dataSource) public feeless(voter) {
    require(token.lock(voter, stake));
    DataProvider storage provider = providers[dataSource];
    uint256 newVoterTokenLock = provider.tokenLocks[voter].add(stake);
    provider.tokenLocks[voter] = newVoterTokenLock;
    _vote(voter, stake, dataSource);
    emit DataSourceStakeChanged(dataSource, provider.stake);
    emit DataSourceVoterTokenLockChanged(dataSource, voter, newVoterTokenLock);
    _repositionUp(_findDataSourceIndex(dataSource));
  }

  function withdraw(address voter, uint256 withdrawOwnership, address dataSource) public feeless(voter) {
    DataProvider storage provider = providers[dataSource];
    require(withdrawOwnership > 0 && withdrawOwnership <= provider.publicOwnerships[voter]);
    uint256 newOwnership = provider.totalPublicOwnership.sub(withdrawOwnership);
    uint256 currentVoterStake = getStakeInProvider(dataSource, voter);
    if (currentVoterStake > provider.tokenLocks[voter]){
      uint256 unrealizedStake = currentVoterStake.sub(provider.tokenLocks[voter]);
      require(token.transfer(voter, unrealizedStake));
      require(token.lock(voter, unrealizedStake));
    }
    uint256 withdrawAmount = provider.stake.mul(withdrawOwnership).div(provider.totalPublicOwnership);
    uint256 newStake = provider.stake.sub(withdrawAmount);
    uint256 newVoterTokenLock = currentVoterStake.sub(withdrawAmount);
    uint256 newVoterOwnership = provider.publicOwnerships[voter].sub(withdrawOwnership);
    provider.stake = newStake;
    provider.totalPublicOwnership = newOwnership;
    provider.publicOwnerships[voter] = newVoterOwnership;
    provider.tokenLocks[voter] = newVoterTokenLock;
    if (voter == provider.owner) {
      uint256 delay = getOwnerDelayWithdrawTime();
      if (delay == 0){
        require(token.unlock(voter, withdrawAmount));
      } else {
        withdrawReceipts.push(ProviderWithdrawReceipt({
          owner: provider.owner,
          amount: withdrawAmount,
          withdrawTime: uint64(now.add(delay)),
          isWithdrawn: false
        }));
        emit OwnerWithdrawReceiptCreated(withdrawReceipts.length - 1, provider.owner, withdrawAmount, uint64(now.add(delay)));
      }
    } else {
      require(token.unlock(voter, withdrawAmount));
    }
    emit DataSourceOwnershipChanged(dataSource, voter, newVoterOwnership, newOwnership);
    emit DataSourceStakeChanged(dataSource, newStake);
    emit DataSourceVoterTokenLockChanged(dataSource, voter, newVoterTokenLock);
    if (provider.currentStatus == DataProviderStatus.Active) {
      _repositionDown(_findDataSourceIndex(dataSource));
    }
    if (provider.owner == voter &&
        getStakeInProvider(dataSource, provider.owner) < params.get(prefix, "min_provider_stake") &&
        provider.currentStatus == DataProviderStatus.Active) {
      kick(dataSource);
    }
  }

  function kick(address dataSource) public {
    DataProvider storage provider = providers[dataSource];
    require(provider.currentStatus == DataProviderStatus.Active);
    address owner = provider.owner;
    require(getStakeInProvider(dataSource, owner) < params.get(prefix, "min_provider_stake"));
    provider.currentStatus = DataProviderStatus.Removed;
    emit DataSourceRemoved(dataSource);
    _repositionDown(_findDataSourceIndex(dataSource));
    dataSources.pop();
  }

  function distributeFee(uint256 tokenAmount) public {
    require(address(this).balance > 0);
    exchange.convertFromEthToBand.value(address(this).balance)();
    bondingCurve.buy(address(this), band.balanceOf(address(this)), tokenAmount);
    undistributedReward = undistributedReward.add(tokenAmount);
    uint256 totalProviderCount = getActiveDataSourceCount();
    uint256 providerReward = undistributedReward.div(totalProviderCount);
    uint256 ownerPercentage = params.get(prefix, "owner_revenue_pct");
    uint256 ownerReward = ownerPercentage.mulFrac(providerReward);
    uint256 stakeIncreased = providerReward.sub(ownerReward);
    for(uint256 dataSourceIndex = 0; dataSourceIndex < totalProviderCount; ++dataSourceIndex) {
      DataProvider storage provider = providers[dataSources[dataSourceIndex]];
      provider.stake = provider.stake.add(stakeIncreased);
      if (ownerReward > 0) {
        _vote(provider.owner, ownerReward, dataSources[dataSourceIndex]);
      }
      undistributedReward = undistributedReward.sub(providerReward);
      emit DataSourceStakeChanged(dataSources[dataSourceIndex], provider.stake);
    }
  }

  function unlockTokenFromReceipt(uint256 receiptId) public {
    ProviderWithdrawReceipt storage receipt = withdrawReceipts[receiptId];
    require(!receipt.isWithdrawn && now >= receipt.withdrawTime);
    receipt.isWithdrawn = true;
    require(token.unlock(receipt.owner, receipt.amount));
    emit OwnerWithdrawReceiptUnlocked(receiptId, receipt.owner, receipt.amount);
  }

  function _findDataSourceIndex(address dataSource) internal view returns (uint256) {
    for (uint256 index = 0; index < dataSources.length; ++index) {
      if (dataSources[index] == dataSource) return index;
    }
    assert(false);
  }

  function _isLhsBetterThanRhs(uint256 left, uint256 right) internal view returns (bool) {
    DataProvider storage leftProvider = providers[dataSources[left]];
    DataProvider storage rightProvider = providers[dataSources[right]];
    if (leftProvider.currentStatus != DataProviderStatus.Active) return false;
    if (rightProvider.currentStatus != DataProviderStatus.Active) return true;
    return leftProvider.stake >= rightProvider.stake;
  }

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
