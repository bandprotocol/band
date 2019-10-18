import { store, BigInt, Address, EthereumBlock } from "@graphprotocol/graph-ts";
import {
  OffchainAggTCD,
  DataUpdated,
  DataSourceRegistered,
  DataSourceStaked,
  DataSourceUnstaked,
  FeeDistributed,
  WithdrawReceiptCreated,
  WithdrawReceiptUnlocked,
  Query
} from "../generated/OffchainAggTCD/OffchainAggTCD";
import {
  Token,
  TCD,
  Report,
  Staking,
  RewardDistribute,
  RewardDistributeEachProvider,
  QueryCounter,
  DataProvider,
  DataProviderOwnership
} from "../generated/schema";

export function handleDataUpdated(event: DataUpdated): void {
  let tcd = TCD.load(event.address.toHexString());

  if (tcd == null) {
    tcd = new TCD(event.address.toHexString());
    let tcdContract = OffchainAggTCD.bind(event.address);
    let tokenAddress = tcdContract.token().toHexString();
    tcd.token = tokenAddress;

    let token = Token.load(tokenAddress);
    token.tcd = event.address.toHexString();
    token.save();
    tcd.queryCount = 0;
    tcd.reportCount = 0;
    tcd.totalFee = BigInt.fromI32(0);
  }

  tcd.reportCount = tcd.reportCount + 1;
  tcd.save();

  let key =
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

  let report = Report.load(key);
  if (report == null) {
    report = new Report(key);
    report.key = event.params.key;
    report.value = event.params.value;
    report.timestamp = event.params.timestamp;
    report.status = event.params.status;
    report.txHash = event.transaction.hash;
    report.contract = event.address;
    report.save();
  }
}

export function handleDataSourceRegistered(event: DataSourceRegistered): void {
  let tcd = TCD.load(event.address.toHexString());
  let tcdContract = OffchainAggTCD.bind(event.address);
  if (tcd == null) {
    tcd = new TCD(event.address.toHexString());
    let tokenAddress = tcdContract.token().toHexString();
    tcd.token = tokenAddress;

    let token = Token.load(tokenAddress);
    token.tcd = event.address.toHexString();
    token.save();

    tcd.prefix = "tcd:";
    tcd.queryCount = 0;
    tcd.reportCount = 0;
    tcd.totalFee = BigInt.fromI32(0);
    tcd.save();
  }

  let dPKey =
    event.params.dataSource.toHexString() + "-" + event.address.toHexString();
  let dpoKey = dPKey + "-" + event.params.owner.toHexString();

  let dataProvider = new DataProvider(dPKey);
  dataProvider.providerAddress = event.params.dataSource;
  dataProvider.owner = event.params.owner;
  dataProvider.stake = event.params.stake;
  dataProvider.ownerOwnership = event.params.stake;
  dataProvider.status = "UNLISTED";
  dataProvider.totalOwnership = event.params.stake;
  dataProvider.tcd = event.address.toHexString();
  dataProvider.save();

  let dataProviderOwnership = new DataProviderOwnership(dpoKey);
  dataProviderOwnership.dataProvider = dPKey;
  dataProviderOwnership.providerAddress = event.params.dataSource;
  dataProviderOwnership.tcdAddress = event.address;
  dataProviderOwnership.ownership = event.params.stake;
  dataProviderOwnership.tokenLock = event.params.stake;
  dataProviderOwnership.voter = event.params.owner;
  dataProviderOwnership.save();
}

function _handleStaking(
  tcdAddress: Address,
  dataSource: Address,
  participant: Address,
  block: EthereumBlock
): void {
  let dPKey = dataSource.toHexString() + "-" + tcdAddress.toHexString();
  let dataProvider = DataProvider.load(dPKey);

  let tcdContract = OffchainAggTCD.bind(tcdAddress);
  let voterOwnership = tcdContract.getOwnership(dataSource, participant);
  let voterStake = tcdContract.getStake(dataSource, participant);

  let sKey =
    block.number.toString() +
    "-" +
    tcdAddress.toHexString() +
    "-" +
    dataProvider.providerAddress.toHexString() +
    "-" +
    participant.toHexString();

  let s = new Staking(sKey);
  s.voter = participant;
  s.blockHeight = block.number.toI32();
  s.tcdAddress = tcdAddress;
  s.providerAddress = dataProvider.providerAddress;
  s.timestamp = block.timestamp;
  s.voterOwnership = voterOwnership;
  s.voterStake = voterStake;
  s.save();
}

export function handleDataSourceStaked(event: DataSourceStaked): void {
  let dpKey =
    event.params.dataSource.toHexString() + "-" + event.address.toHexString();
  let dataProvider = DataProvider.load(dpKey);

  let dpoKey = dpKey + "-" + event.params.participant.toHexString();
  let voterOwnership = DataProviderOwnership.load(dpoKey);

  let tcdContract = OffchainAggTCD.bind(
    Address.fromString(event.address.toHexString())
  );
  let dataSourceInfo = tcdContract.infoMap(
    Address.fromString(event.params.dataSource.toHexString())
  );

  dataProvider.stake = dataSourceInfo.value1;
  dataProvider.totalOwnership = dataSourceInfo.value2;

  let newVoterOwnership = tcdContract.getOwnership(
    Address.fromString(event.params.dataSource.toHexString()),
    Address.fromString(event.params.participant.toHexString())
  );

  if (voterOwnership == null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership = new DataProviderOwnership(dpoKey);
    voterOwnership.providerAddress = Address.fromString(
      event.params.dataSource.toHexString()
    );
    voterOwnership.tcdAddress = Address.fromString(event.address.toHexString());
    voterOwnership.voter = Address.fromString(
      event.params.participant.toHexString()
    );
    voterOwnership.dataProvider = dpKey;
    voterOwnership.ownership = newVoterOwnership;
    voterOwnership.tokenLock = event.params.stake;

    voterOwnership.save();
  } else if (voterOwnership != null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership.ownership = newVoterOwnership;
    voterOwnership.tokenLock = voterOwnership.tokenLock.plus(
      event.params.stake
    );
    voterOwnership.save();
  } else if (
    voterOwnership != null &&
    newVoterOwnership.equals(new BigInt(0))
  ) {
    store.remove("DataProviderOwnership", dpoKey);
  }

  if (
    event.params.participant.toHexString() == dataProvider.owner.toHexString()
  ) {
    dataProvider.ownerOwnership = newVoterOwnership;
  }
  dataProvider.save();

  _handleStaking(
    event.address,
    event.params.dataSource,
    event.params.participant,
    event.block
  );
}

export function handleDataSourceUnstaked(event: DataSourceUnstaked): void {
  let dpKey =
    event.params.dataSource.toHexString() + "-" + event.address.toHexString();
  let dataProvider = DataProvider.load(dpKey);

  let dpoKey = dpKey + "-" + event.params.participant.toHexString();
  let voterOwnership = DataProviderOwnership.load(dpoKey);

  let tcdContract = OffchainAggTCD.bind(
    Address.fromString(event.address.toHexString())
  );
  let dataSourceInfo = tcdContract.infoMap(
    Address.fromString(event.params.dataSource.toHexString())
  );

  dataProvider.stake = dataSourceInfo.value1;
  dataProvider.totalOwnership = dataSourceInfo.value2;

  let newVoterOwnership = tcdContract.getOwnership(
    Address.fromString(event.params.dataSource.toHexString()),
    Address.fromString(event.params.participant.toHexString())
  );

  if (voterOwnership == null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership = new DataProviderOwnership(dpoKey);
    voterOwnership.providerAddress = Address.fromString(
      event.params.dataSource.toHexString()
    );
    voterOwnership.tcdAddress = Address.fromString(event.address.toHexString());
    voterOwnership.voter = Address.fromString(
      event.params.participant.toHexString()
    );
    voterOwnership.dataProvider = dpKey;
    voterOwnership.ownership = newVoterOwnership;
    voterOwnership.tokenLock = voterOwnership.ownership
      .times(dataProvider.stake)
      .div(dataProvider.totalOwnership);
    voterOwnership.save();
  } else if (voterOwnership != null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership.ownership = newVoterOwnership;
    voterOwnership.tokenLock = voterOwnership.ownership
      .times(dataProvider.stake)
      .div(dataProvider.totalOwnership);
    voterOwnership.save();
  } else if (
    voterOwnership != null &&
    newVoterOwnership.equals(new BigInt(0))
  ) {
    store.remove("DataProviderOwnership", dpoKey);
  }

  if (
    event.params.participant.toHexString() == dataProvider.owner.toHexString()
  ) {
    dataProvider.ownerOwnership = newVoterOwnership;
  }
  dataProvider.save();
  _handleStaking(
    event.address,
    event.params.dataSource,
    event.params.participant,
    event.block
  );
}

export function handleFeeDistributed(event: FeeDistributed): void {
  let dPKey =
    event.params.dataSource.toHexString() + "-" + event.address.toHexString();
  let dataProvider = DataProvider.load(dPKey);
  let dpKey =
    event.params.dataSource.toHexString() + "-" + event.address.toHexString();

  let dpoKey = dpKey + "-" + dataProvider.owner.toHexString();
  let voterOwnership = DataProviderOwnership.load(dpoKey);

  let tcdContract = OffchainAggTCD.bind(
    Address.fromString(event.address.toHexString())
  );
  let dataSourceInfo = tcdContract.infoMap(
    Address.fromString(event.params.dataSource.toHexString())
  );

  dataProvider.stake = dataSourceInfo.value1;
  dataProvider.totalOwnership = dataSourceInfo.value2;

  let newVoterOwnership = tcdContract.getOwnership(
    Address.fromString(event.params.dataSource.toHexString()),
    Address.fromString(dataProvider.owner.toHexString())
  );

  if (voterOwnership == null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership = new DataProviderOwnership(dpoKey);
    voterOwnership.providerAddress = Address.fromString(
      event.params.dataSource.toHexString()
    );
    voterOwnership.tcdAddress = Address.fromString(event.address.toHexString());
    voterOwnership.voter = Address.fromString(dataProvider.owner.toHexString());
    voterOwnership.dataProvider = dpKey;
    voterOwnership.ownership = newVoterOwnership;

    voterOwnership.save();
  } else if (voterOwnership != null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership.ownership = newVoterOwnership;

    voterOwnership.save();
  } else if (
    voterOwnership != null &&
    newVoterOwnership.equals(new BigInt(0))
  ) {
    store.remove("DataProviderOwnership", dpoKey);
  }

  if (dataProvider.owner.toHexString() == dataProvider.owner.toHexString()) {
    dataProvider.ownerOwnership = newVoterOwnership;
  }
  dataProvider.save();

  let tokenAddress = tcdContract.token();

  let rdKey = event.block.number.toString() + "-" + event.address.toHexString();
  let rd = RewardDistribute.load(rdKey);
  if (rd == null) {
    rd = new RewardDistribute(rdKey);
    rd.blockHeight = event.block.number.toI32();
    rd.timestamp = event.block.timestamp;
    rd.tcdAddress = event.address;
    rd.tokenAddress = tokenAddress;
    rd.save();
  }

  let rdepKey = rdKey + "-" + dataProvider.providerAddress.toHexString();
  let rdep = new RewardDistributeEachProvider(rdepKey);
  rdep.blockHeight = event.block.number.toI32();
  rdep.tcdAddress = event.address;
  rdep.tokenAddress = tokenAddress;
  rdep.providerAddress = dataProvider.providerAddress;
  rdep.timestamp = event.block.timestamp;
  rdep.totalStake = dataProvider.stake;
  rdep.stakeIncreased = event.params.totalReward.minus(
    event.params.ownerReward
  );
  rdep.totalOwnership = dataProvider.totalOwnership;
  rdep.ownerReward = event.params.ownerReward;
  rdep.ownerOwnership = dataProvider.ownerOwnership;
  rdep.totalReward = event.params.totalReward;
  rdep.rewardDistribute = rdKey;
  rdep.save();
}

export function handleWithdrawReceiptCreated(
  event: WithdrawReceiptCreated
): void {}

export function handleWithdrawReceiptUnlocked(
  event: WithdrawReceiptUnlocked
): void {}

export function handleQuery(event: Query): void {
  let tcd = TCD.load(event.address.toHexString());

  if (tcd == null) {
    tcd = new TCD(event.address.toHexString());
    let tcdContract = OffchainAggTCD.bind(event.address);
    let tokenAddress = tcdContract.token().toHexString();
    tcd.token = tokenAddress;

    let token = Token.load(tokenAddress);
    token.tcd = event.address.toHexString();
    token.save();

    tcd.queryCount = 0;
    tcd.reportCount = 0;
    tcd.totalFee = BigInt.fromI32(0);
  }
  let tcdContract = OffchainAggTCD.bind(event.address);
  tcd.queryCount = tcd.queryCount + 1;
  tcd.totalFee = tcd.totalFee.plus(tcdContract.queryPrice());
  tcd.save();

  let hourInterval = event.block.timestamp.div(BigInt.fromI32(3600));
  let startTime = hourInterval.times(BigInt.fromI32(3600));

  let key = event.address.toHexString() + "/" + hourInterval.toString();
  let counter = QueryCounter.load(key);
  if (counter == null) {
    counter = new QueryCounter(key);
    counter.startTime = startTime;
    counter.query = 0;
    counter.contract = event.address;
  }

  counter.query = counter.query + 1;
  counter.save();
}
