pragma solidity 0.5.9;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./QueryInterface.sol";
import "../utils/Fractional.sol";
import "../exchange/BondingCurve.sol";
import "../token/LockableToken.sol";
import "../Parameters.sol";


/// "TCDBase" is the base class for Band Protocol's Token-Curated DataSources implementation. The contract essentially
/// keeps track of a sorted list of trusted data sources, based on the total amount of token stake the data sources
/// have. Any one can apply for a new data source using `register` function. Token holders can `stake` or `unstake`
/// for any existing data sources. This class is abstract, so it needs to be extended by a subclass that utilizes
/// the list of active data sources (See AggTCD and MultiSigTCD). Fees are collected in ETH and are converted to
/// dataset tokens during `distributeFee` function call.
contract TCDBase is QueryInterface {
  using Fractional for uint256;
  using SafeMath for uint256;

  event DataSourceRegistered(address indexed dataSource, address indexed owner, uint256 stake);
  event DataSourceStaked(address indexed dataSource, address indexed participant, uint256 stake);
  event DataSourceUnstaked(address indexed dataSource, address indexed participant, uint256 unstake);
  event FeeDistributed(address indexed dataSource, uint256 totalReward, uint256 ownerReward);
  event WithdrawReceiptCreated(uint256 receiptIndex, address indexed owner, uint256 amount, uint64 withdrawTime);
  event WithdrawReceiptUnlocked(uint256 receiptIndex, address indexed owner, uint256 amount);

  enum Order {EQ, LT, GT}

  struct DataSourceInfo {
    address owner;
    uint256 stake;
    uint256 totalOwnerships;
    mapping (address => uint256) tokenLocks;
    mapping (address => uint256) ownerships;
  }

  struct WithdrawReceipt {
    address owner;
    uint256 amount;
    uint64 withdrawTime;
    bool isWithdrawn;
  }

  mapping (address => DataSourceInfo) public infoMap;
  mapping (address => address) activeList;
  mapping (address => address) reserveList;
  uint256 public activeCount;
  uint256 public reserveCount;

  address constant internal NOT_FOUND = address(0x00);
  address constant internal ACTIVE_GUARD = address(0x01);
  address constant internal RESERVE_GUARD = address(0x02);
  WithdrawReceipt[] public withdrawReceipts;

  BondingCurve public bondingCurve;
  Parameters public params;
  LockableToken public token;
  uint256 public undistributedReward;
  bytes8 public prefix;

  constructor(bytes8 _prefix, BondingCurve _bondingCurve, Parameters _params, BandRegistry _registry) public QueryInterface(_registry) {
    bondingCurve = _bondingCurve;
    params = _params;
    prefix = _prefix;
    token = LockableToken(address(_bondingCurve.bondedToken()));
    _registry.band().approve(address(_bondingCurve), 2 ** 256 - 1);
    activeList[ACTIVE_GUARD] = ACTIVE_GUARD;
    reserveList[RESERVE_GUARD] = RESERVE_GUARD;
  }

  function getOwnership(address dataSource, address staker) public view returns (uint256) {
    return infoMap[dataSource].ownerships[staker];
  }

  function getStake(address dataSource, address staker) public view returns (uint256) {
    DataSourceInfo storage provider = infoMap[dataSource];
    if (provider.totalOwnerships == 0) return 0;
    return provider.ownerships[staker].mul(provider.stake).div(provider.totalOwnerships);
  }

  function register(address dataSource, address prevDataSource, uint256 initialStake) public {
    require(token.lock(msg.sender, initialStake));
    require(infoMap[dataSource].totalOwnerships == 0);
    require(initialStake > 0 && initialStake >= params.get(prefix, "min_provider_stake"));
    infoMap[dataSource] = DataSourceInfo({
      owner: msg.sender,
      stake: initialStake,
      totalOwnerships: initialStake
    });
    infoMap[dataSource].ownerships[msg.sender] = initialStake;
    infoMap[dataSource].tokenLocks[msg.sender] = initialStake;
    emit DataSourceRegistered(dataSource, msg.sender, initialStake);
    _addDataSource(dataSource, prevDataSource);
    _rebalanceLists();
  }

  function stake(address dataSource, address prevDataSource, address newPrevDataSource, uint256 value) public {
    require(token.lock(msg.sender, value));
    _removeDataSource(dataSource, prevDataSource);
    DataSourceInfo storage provider = infoMap[dataSource];
    uint256 newStakerTokenLock = provider.tokenLocks[msg.sender].add(value);
    provider.tokenLocks[msg.sender] = newStakerTokenLock;
    _stake(msg.sender, value, dataSource);
    if (getStake(dataSource, provider.owner) >= params.get(prefix, "min_provider_stake")) {
      _addDataSource(dataSource, newPrevDataSource);
    }
    _rebalanceLists();
  }

  function unstake(address dataSource, address prevDataSource, address newPrevDataSource, uint256 withdrawOwnership) public {
    DataSourceInfo storage provider = infoMap[dataSource];
    require(withdrawOwnership <= provider.ownerships[msg.sender]);
    _removeDataSource(dataSource, prevDataSource);
    uint256 newOwnership = provider.totalOwnerships.sub(withdrawOwnership);
    uint256 currentStakerStake = getStake(dataSource, msg.sender);
    if (currentStakerStake > provider.tokenLocks[msg.sender]){
      uint256 unrealizedStake = currentStakerStake.sub(provider.tokenLocks[msg.sender]);
      require(token.transfer(msg.sender, unrealizedStake));
      require(token.lock(msg.sender, unrealizedStake));
    }
    uint256 withdrawAmount = provider.stake.mul(withdrawOwnership).div(provider.totalOwnerships);
    uint256 newStake = provider.stake.sub(withdrawAmount);
    uint256 newStakerTokenLock = currentStakerStake.sub(withdrawAmount);
    uint256 newStakerOwnership = provider.ownerships[msg.sender].sub(withdrawOwnership);
    provider.stake = newStake;
    provider.totalOwnerships = newOwnership;
    provider.ownerships[msg.sender] = newStakerOwnership;
    provider.tokenLocks[msg.sender] = newStakerTokenLock;
    uint256 delay;
    if (msg.sender == provider.owner && (delay = params.get(prefix, "withdraw_delay")) > 0) {
      uint256 withdrawTime = now.add(delay);
      require(withdrawTime < (1 << 64));
      withdrawReceipts.push(WithdrawReceipt({
        owner: provider.owner,
        amount: withdrawAmount,
        withdrawTime: uint64(withdrawTime),
        isWithdrawn: false
      }));
      emit WithdrawReceiptCreated(withdrawReceipts.length - 1, provider.owner, withdrawAmount, uint64(withdrawTime));
    } else {
      require(token.unlock(msg.sender, withdrawAmount));
    }
    emit DataSourceUnstaked(dataSource, msg.sender, withdrawAmount);
    if (getStake(dataSource, provider.owner) >= params.get(prefix, "min_provider_stake")) {
      _addDataSource(dataSource, newPrevDataSource);
    }
    _rebalanceLists();
  }

  function distributeFee(uint256 tokenAmount) public {
    require(address(this).balance > 0);
    registry.exchange().convertFromEthToBand.value(address(this).balance)();
    bondingCurve.buy(address(this), registry.band().balanceOf(address(this)), tokenAmount);
    undistributedReward = undistributedReward.add(tokenAmount);
    uint256 providerReward = undistributedReward.div(activeCount);
    uint256 ownerPercentage = params.get(prefix, "owner_revenue_pct");
    uint256 ownerReward = ownerPercentage.mulFrac(providerReward);
    uint256 stakeIncreased = providerReward.sub(ownerReward);
    address dataSourceAddress = activeList[ACTIVE_GUARD];
    while (dataSourceAddress != ACTIVE_GUARD) {
      DataSourceInfo storage provider = infoMap[dataSourceAddress];
      provider.stake = provider.stake.add(stakeIncreased);
      if (ownerReward > 0) _stake(provider.owner, ownerReward, dataSourceAddress);
      undistributedReward = undistributedReward.sub(providerReward);
      emit FeeDistributed(dataSourceAddress, providerReward, ownerReward);
      dataSourceAddress = activeList[dataSourceAddress];
    }
  }

  function unlockTokenFromReceipt(uint256 receiptId) public {
    WithdrawReceipt storage receipt = withdrawReceipts[receiptId];
    require(!receipt.isWithdrawn && now >= receipt.withdrawTime);
    receipt.isWithdrawn = true;
    require(token.unlock(receipt.owner, receipt.amount));
    emit WithdrawReceiptUnlocked(receiptId, receipt.owner, receipt.amount);
  }

  function _stake(address staker, uint256 value, address dataSource) internal {
    DataSourceInfo storage provider = infoMap[dataSource];
    require(provider.totalOwnerships > 0);
    uint256 newStake = provider.stake.add(value);
    uint256 newtotalOwnerships = newStake.mul(provider.totalOwnerships).div(provider.stake);
    uint256 newStakerOwnership = provider.ownerships[staker].add(newtotalOwnerships.sub(provider.totalOwnerships));
    provider.ownerships[staker] = newStakerOwnership;
    provider.stake = newStake;
    provider.totalOwnerships = newtotalOwnerships;
    emit DataSourceStaked(dataSource, staker, value);
  }

  function _compare(address dataSourceLeft, address dataSourceRight) internal view returns (Order) {
    if (dataSourceLeft == dataSourceRight) return Order.EQ;
    DataSourceInfo storage leftProvider = infoMap[dataSourceLeft];
    DataSourceInfo storage rightProvider = infoMap[dataSourceRight];
    if (leftProvider.stake != rightProvider.stake) return leftProvider.stake < rightProvider.stake ? Order.LT : Order.GT;
    return uint256(dataSourceLeft) < uint256(dataSourceRight) ? Order.LT : Order.GT; /// Arbitrary tie-breaker
  }

  function _findPrevDataSource(address dataSource) internal view returns (address) {
    if (activeCount != 0 && _compare(dataSource, activeList[ACTIVE_GUARD]) != Order.LT) {
      address currentIndex = ACTIVE_GUARD;
      while (activeList[currentIndex] != ACTIVE_GUARD) {
        address nextIndex = activeList[currentIndex];
        if (_compare(dataSource, nextIndex) == Order.GT) currentIndex = nextIndex;
        else break;
      }
      return currentIndex;
    } else if (reserveCount != 0) {
      address currentIndex = RESERVE_GUARD;
      while (reserveList[currentIndex] != RESERVE_GUARD) {
        address nextIndex = reserveList[currentIndex];
        if (_compare(dataSource, nextIndex) == Order.LT) currentIndex = nextIndex;
        else break;
      }
      return currentIndex;
    } else {
      return RESERVE_GUARD;
    }
  }

  function _addDataSource(address dataSource, address _prevDataSource) internal {
    address prevDataSource = _prevDataSource == NOT_FOUND ? _findPrevDataSource(dataSource) : _prevDataSource;
    if (activeList[prevDataSource] != NOT_FOUND) {
      if (prevDataSource == ACTIVE_GUARD) require(reserveCount == 0 || _compare(dataSource, reserveList[RESERVE_GUARD]) == Order.GT);
      else require(_compare(dataSource, prevDataSource) == Order.GT);
      require(activeList[prevDataSource] == ACTIVE_GUARD || _compare(activeList[prevDataSource], dataSource) == Order.GT);
      activeList[dataSource] = activeList[prevDataSource];
      activeList[prevDataSource] = dataSource;
      activeCount++;
    } else if (reserveList[prevDataSource] != NOT_FOUND) {
      if (prevDataSource == RESERVE_GUARD) require(activeCount == 0 || _compare(activeList[ACTIVE_GUARD], dataSource) == Order.GT);
      else require(_compare(prevDataSource, dataSource) == Order.GT);
      require(reserveList[prevDataSource] == RESERVE_GUARD || _compare(dataSource, reserveList[prevDataSource]) == Order.GT);
      reserveList[dataSource] = reserveList[prevDataSource];
      reserveList[prevDataSource] = dataSource;
      reserveCount++;
    } else {
      revert();
    }
  }

  function _removeDataSource(address dataSource, address _prevDataSource) internal {
    if (activeList[dataSource] == NOT_FOUND && reserveList[dataSource] == NOT_FOUND) return;
    address prevDataSource = _prevDataSource == NOT_FOUND ? _findPrevDataSource(dataSource) : _prevDataSource;
    if (activeList[prevDataSource] != NOT_FOUND) {
      require(dataSource != ACTIVE_GUARD);
      require(activeList[prevDataSource] == dataSource);
      activeList[prevDataSource] = activeList[dataSource];
      activeList[dataSource] = NOT_FOUND;
      activeCount--;
    } else if (reserveList[prevDataSource] != NOT_FOUND) {
      require(dataSource != RESERVE_GUARD);
      require(reserveList[prevDataSource] == dataSource);
      reserveList[prevDataSource] = reserveList[dataSource];
      reserveList[dataSource] = NOT_FOUND;
      reserveCount--;
    }
  }

  function _rebalanceLists() internal {
    uint256 maxProviderCount = params.get(prefix, "max_provider_count");
    while (activeCount < maxProviderCount && reserveCount > 0) {
      address dataSource = reserveList[RESERVE_GUARD];
      _removeDataSource(dataSource, RESERVE_GUARD);
      _addDataSource(dataSource, ACTIVE_GUARD);
    }
    while (activeCount > maxProviderCount) {
      address dataSource = activeList[ACTIVE_GUARD];
      _removeDataSource(dataSource, ACTIVE_GUARD);
      _addDataSource(dataSource, RESERVE_GUARD);
    }
  }
}
