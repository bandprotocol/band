pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";

import "./QueryInterface.sol";
import "../utils/Fractional.sol";
import "../exchange/BondingCurve.sol";
import "../token/LockableToken.sol";
import "../Parameters.sol";


contract TCDBase is QueryInterface {
  using Fractional for uint256;
  using SafeMath for uint256;

  event DataSourceRegistered(address indexed dataSource, address indexed owner, uint256 stake);
  event DataSourceStaked(address indexed dataSource, address indexed participant, uint256 stake);
  event DataSourceUnstaked(address indexed dataSource, address indexed participant, uint256 unstake);
  event RewardDistributed(address indexed dataSource);

  event OwnerWithdrawReceiptCreated(uint256 receiptIndex, address indexed owner, uint256 amount, uint64 withdrawTime);
  event OwnerWithdrawReceiptUnlocked(uint256 receiptIndex, address indexed owner, uint256 amount);

  enum Comparator {EQ, LT, GT}

  struct DataProvider {
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

  mapping (address => DataProvider) public providers;
  mapping (address => address) public activeProviders;
  mapping (address => address) public reserveProviders;

  uint256 public activeProviderLength;
  uint256 public reserveProviderLength;

  address constant internal NOT_FOUND = address(0x00);
  address constant internal ACTIVE_HEADER = address(0x01);
  address constant internal RESERVE_HEADER = address(0x02);
  ProviderWithdrawReceipt[] public withdrawReceipts;

  BondingCurve public bondingCurve;
  Parameters public params;
  LockableToken public token;
  uint256 public undistributedReward;
  bytes8 public prefix;

  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry)
    public QueryInterface(_registry)
  {
    bondingCurve = _bondingCurve;
    params = _params;
    prefix = _prefix;
    token = LockableToken(address(_bondingCurve.bondedToken()));
    _registry.band().approve(address(_bondingCurve), 2 ** 256 - 1);
    activeProviders[ACTIVE_HEADER] = ACTIVE_HEADER;
    reserveProviders[RESERVE_HEADER] = RESERVE_HEADER;
  }

  function getProviderPublicOwnership(address dataSource, address voter)  public view returns (uint256) {
    return providers[dataSource].publicOwnerships[voter];
  }

  function getStakeInProvider(address dataSource, address voter) public view returns (uint256) {
    DataProvider storage provider = providers[dataSource];
    if (provider.totalPublicOwnership == 0) return 0;
    return provider.publicOwnerships[voter].mul(provider.stake).div(provider.totalPublicOwnership);
  }

  function register(address dataSource, address prevDataSource, uint256 stake) public {
    require(token.lock(msg.sender, stake));
    require(providers[dataSource].totalPublicOwnership == 0);
    require(stake > 0 && stake >= params.get(prefix, "min_provider_stake"));

    providers[dataSource] = DataProvider({
      owner: msg.sender,
      stake: stake,
      totalPublicOwnership: stake
    });
    providers[dataSource].publicOwnerships[msg.sender] = stake;
    providers[dataSource].tokenLocks[msg.sender] = stake;
    emit DataSourceRegistered(dataSource, msg.sender, stake);
    _addDataSourceToList(dataSource, prevDataSource);
    _updateActiveList();
  }

  function vote(address dataSource, address prevDataSource, address newPrevDataSource, uint256 stake) public {
    require(token.lock(msg.sender, stake));
    _removeDataSourceFromList(dataSource, prevDataSource);
    DataProvider storage provider = providers[dataSource];
    uint256 newVoterTokenLock = provider.tokenLocks[msg.sender].add(stake);
    provider.tokenLocks[msg.sender] = newVoterTokenLock;
    _vote(msg.sender, stake, dataSource);
    if (getStakeInProvider(dataSource, provider.owner) >= params.get(prefix, "min_provider_stake")) {
      _addDataSourceToList(dataSource, newPrevDataSource);
    }
    _updateActiveList();
  }

  function withdraw(address dataSource, address prevDataSource, address newPrevDataSource, uint256 withdrawOwnership)
    public
  {
    DataProvider storage provider = providers[dataSource];
    require(withdrawOwnership <= provider.publicOwnerships[msg.sender]);
    _removeDataSourceFromList(dataSource, prevDataSource);
    uint256 newOwnership = provider.totalPublicOwnership.sub(withdrawOwnership);
    uint256 currentVoterStake = getStakeInProvider(dataSource, msg.sender);
    if (currentVoterStake > provider.tokenLocks[msg.sender]){
      uint256 unrealizedStake = currentVoterStake.sub(provider.tokenLocks[msg.sender]);
      require(token.transfer(msg.sender, unrealizedStake));
      require(token.lock(msg.sender, unrealizedStake));
    }
    uint256 withdrawAmount = provider.stake.mul(withdrawOwnership).div(provider.totalPublicOwnership);
    uint256 newStake = provider.stake.sub(withdrawAmount);
    uint256 newVoterTokenLock = currentVoterStake.sub(withdrawAmount);
    uint256 newVoterOwnership = provider.publicOwnerships[msg.sender].sub(withdrawOwnership);
    provider.stake = newStake;
    provider.totalPublicOwnership = newOwnership;
    provider.publicOwnerships[msg.sender] = newVoterOwnership;
    provider.tokenLocks[msg.sender] = newVoterTokenLock;
    if (msg.sender == provider.owner) {
      uint256 delay = params.get(prefix, "withdraw_delay");
      if (delay == 0) {
        require(token.unlock(msg.sender, withdrawAmount));
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
      require(token.unlock(msg.sender, withdrawAmount));
    }
    emit DataSourceUnstaked(dataSource, msg.sender, withdrawAmount);

    // Update List
    if (getStakeInProvider(dataSource, provider.owner) >= params.get(prefix, "min_provider_stake")) {
      _addDataSourceToList(dataSource, newPrevDataSource);
    }
    _updateActiveList();
  }

  function distributeFee(uint256 tokenAmount) public {
    require(address(this).balance > 0);
    registry.exchange().convertFromEthToBand.value(address(this).balance)();
    bondingCurve.buy(address(this), registry.band().balanceOf(address(this)), tokenAmount);
    undistributedReward = undistributedReward.add(tokenAmount);
    uint256 providerReward = undistributedReward.div(activeProviderLength);
    uint256 ownerPercentage = params.get(prefix, "owner_revenue_pct");
    uint256 ownerReward = ownerPercentage.mulFrac(providerReward);
    uint256 stakeIncreased = providerReward.sub(ownerReward);
    address dataSourceAddress = activeProviders[ACTIVE_HEADER];
    while (dataSourceAddress != ACTIVE_HEADER) {
      DataProvider storage provider = providers[dataSourceAddress];
      provider.stake = provider.stake.add(stakeIncreased);
      if (ownerReward > 0) _vote(provider.owner, ownerReward, dataSourceAddress);
      undistributedReward = undistributedReward.sub(providerReward);
      emit RewardDistributed(dataSourceAddress);
      dataSourceAddress = activeProviders[dataSourceAddress];
    }
  }

  function unlockTokenFromReceipt(uint256 receiptId) public {
    ProviderWithdrawReceipt storage receipt = withdrawReceipts[receiptId];
    require(!receipt.isWithdrawn && now >= receipt.withdrawTime);
    receipt.isWithdrawn = true;
    require(token.unlock(receipt.owner, receipt.amount));
    emit OwnerWithdrawReceiptUnlocked(receiptId, receipt.owner, receipt.amount);
  }

  function _vote(address voter, uint256 stake, address dataSource) internal {
    DataProvider storage provider = providers[dataSource];
    require(provider.totalPublicOwnership > 0);
    uint256 newStake = provider.stake.add(stake);
    uint256 newTotalPublicOwnership = newStake.mul(provider.totalPublicOwnership).div(provider.stake);
    uint256 newVoterPublicOwnership = provider.publicOwnerships[voter].add(newTotalPublicOwnership.sub(provider.totalPublicOwnership));
    provider.publicOwnerships[voter] = newVoterPublicOwnership;
    provider.stake = newStake;
    provider.totalPublicOwnership = newTotalPublicOwnership;
    emit DataSourceStaked(dataSource, voter, stake);
  }

  function _compare(address dataSourceLeft, address dataSourceRight) internal view returns (Comparator) {
    if (dataSourceLeft == dataSourceRight)
      return Comparator.EQ;
    DataProvider storage leftProvider = providers[dataSourceLeft];
    DataProvider storage rightProvider = providers[dataSourceRight];
    if (leftProvider.stake != rightProvider.stake)
      return leftProvider.stake < rightProvider.stake ? Comparator.LT : Comparator.GT;
    return uint256(dataSourceLeft) < uint256(dataSourceRight) ? Comparator.LT : Comparator.GT; /// Arbitrary tie-breaker
  }

  function _findPrevDataSourceAddress(address dataSource) internal view returns (address) {
    if (activeProviderLength != 0 && _compare(dataSource, activeProviders[ACTIVE_HEADER]) != Comparator.LT) {
      // This data source should be active list
      address currentIndex = ACTIVE_HEADER;
      while (activeProviders[currentIndex] != ACTIVE_HEADER) {
        address nextIndex = activeProviders[currentIndex];
        if (_compare(dataSource, nextIndex) == Comparator.GT)
          currentIndex = nextIndex;
        else
          break;
      }
      return currentIndex;
    }
    else {
      if (reserveProviderLength == 0) return RESERVE_HEADER;
      address currentIndex = RESERVE_HEADER;
      while (reserveProviders[currentIndex] != RESERVE_HEADER) {
        address nextIndex = reserveProviders[currentIndex];
        if (_compare(dataSource, nextIndex) == Comparator.LT)
          currentIndex = nextIndex;
        else
          break;
      }
      return currentIndex;
    }
  }

  function _addDataSourceToList(address dataSource, address newPrevDataSource) internal {
    address prevDataSource = newPrevDataSource;
    if (newPrevDataSource == NOT_FOUND) {
      prevDataSource = _findPrevDataSourceAddress(dataSource);
    }
    if (activeProviders[prevDataSource] != NOT_FOUND) {
      // Add to active provider list
      if (prevDataSource == ACTIVE_HEADER) {
        require(reserveProviderLength == 0 || _compare(dataSource, reserveProviders[RESERVE_HEADER]) == Comparator.GT);
      }
      else {
        require(_compare(dataSource, prevDataSource) == Comparator.GT);
      }
      require(activeProviders[prevDataSource] == ACTIVE_HEADER ||
        _compare(activeProviders[prevDataSource], dataSource) == Comparator.GT);
      activeProviders[dataSource] = activeProviders[prevDataSource];
      activeProviders[prevDataSource] = dataSource;
      activeProviderLength++;
    }
    else if (reserveProviders[prevDataSource] != address(0x00)) {
      // Add to reserve provider list
      if (prevDataSource == RESERVE_HEADER) {
        require(activeProviderLength == 0 || _compare(activeProviders[ACTIVE_HEADER], dataSource) == Comparator.GT);
      }
      else {
        require(_compare(prevDataSource, dataSource) == Comparator.GT);
      }
      require(reserveProviders[prevDataSource] == RESERVE_HEADER ||
        _compare(dataSource, reserveProviders[prevDataSource]) == Comparator.GT);
      reserveProviders[dataSource] = reserveProviders[prevDataSource];
      reserveProviders[prevDataSource] = dataSource;
      reserveProviderLength++;
    }
    else {
      revert();
    }
  }

  function _removeDataSourceFromList(address dataSource, address _prevDataSource) internal {
    if (activeProviders[dataSource] == NOT_FOUND && reserveProviders[dataSource] == NOT_FOUND)
      return;
    address prevDataSource = _prevDataSource;
    if (_prevDataSource == NOT_FOUND) {
      prevDataSource = _findPrevDataSourceAddress(dataSource);
    }
    if (activeProviders[prevDataSource] != NOT_FOUND) {
      require(dataSource != ACTIVE_HEADER);
      require(activeProviders[prevDataSource] == dataSource);
      activeProviders[prevDataSource] = activeProviders[dataSource];
      activeProviders[dataSource] = NOT_FOUND;
      activeProviderLength--;
    }
    else if (reserveProviders[prevDataSource] != NOT_FOUND) {
      require(dataSource != RESERVE_HEADER);
      require(reserveProviders[prevDataSource] == dataSource);
      reserveProviders[prevDataSource] = reserveProviders[dataSource];
      reserveProviders[dataSource] = NOT_FOUND;
      reserveProviderLength--;
    }
  }

  function _updateActiveList() internal {
    // Add item to active list
    uint256 maxProviderCount = params.get(prefix, "max_provider_count");
    while(activeProviderLength < maxProviderCount && reserveProviderLength > 0) {
      address dataSource = reserveProviders[RESERVE_HEADER];
      _removeDataSourceFromList(dataSource, RESERVE_HEADER);
      _addDataSourceToList(dataSource, ACTIVE_HEADER);
    }

    // Remove exceed dataSource from active list
    while(activeProviderLength > maxProviderCount) {
      address dataSource = activeProviders[ACTIVE_HEADER];
      _removeDataSourceFromList(dataSource, ACTIVE_HEADER);
      _addDataSourceToList(dataSource, RESERVE_HEADER);
    }
  }
}
