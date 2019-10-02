import { store, BigInt, crypto, ByteArray, Address, Bytes } from "@graphprotocol/graph-ts";
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
} from "../generated/PriceTCD/OffchainAggTCD";
import {
  TCD,
  Report,
  QueryCounter,
  DataProvider,
  DataProviderOwnership
} from "../generated/schema";

function updateProvider(
  tcdAddress: ByteArray,
  dataSourceAddress: ByteArray,
  participant: ByteArray
): void {
  let dpKey = dataSourceAddress.toHexString() + "-" + tcdAddress.toHexString();
  let dataProvider = DataProvider.load(dpKey);

  let dpoKey = dpKey + "-" + participant.toHexString();
  let voterOwnership = DataProviderOwnership.load(dpoKey);

  let tcdContract = OffchainAggTCD.bind(Address.fromString(tcdAddress.toHexString()));
  let dataSourceInfo = tcdContract.infoMap(Address.fromString(dataSourceAddress.toHexString()));

  dataProvider.stake = dataSourceInfo.value1;
  dataProvider.totalOwnership = dataSourceInfo.value2;

  let newVoterOwnership = tcdContract.getOwnership(
    Address.fromString(dataSourceAddress.toHexString()),
    Address.fromString(participant.toHexString())
  );

  if (voterOwnership == null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership = new DataProviderOwnership(dpoKey);
    voterOwnership.dataSourceAddress = Address.fromString(dataSourceAddress.toHexString());
    voterOwnership.tcdAddress = Address.fromString(tcdAddress.toHexString());
    voterOwnership.voter = Address.fromString(participant.toHexString());
    //voterOwnership.tokenLock = ''
    voterOwnership.ownership = newVoterOwnership;
    voterOwnership.save();
  } else if (voterOwnership != null && newVoterOwnership.gt(new BigInt(0))) {
    voterOwnership.ownership = newVoterOwnership;
    voterOwnership.save();
  } else if (voterOwnership != null && newVoterOwnership.equals(new BigInt(0))) {
    store.remove("DataProviderOwnership", dpoKey);
  }

  dataProvider.save();
}

export function handleDataUpdated(event: DataUpdated): void {
  let tcd = TCD.load(event.address.toHexString());

  if (tcd == null) {
    tcd = new TCD(event.address.toHexString());

    tcd.queryCount = 0;
    tcd.reportCount = 0;
  }

  tcd.reportCount = tcd.reportCount + 1;
  tcd.save();

  let key = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

  let report = Report.load(key);
  if (report === null) {
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
    tcd.tokenAddress = tcdContract.token();
    tcd.prefix = "tcd:";
    tcd.queryCount = 0;
    tcd.reportCount = 0;
  }

  let dPKey = event.params.dataSource.toHexString() + "-" + event.address.toHexString();
  let dpoKey = dPKey + "-" + event.params.owner.toHexString();

  let dataProvider = new DataProvider(dPKey);
  dataProvider.dataSourceAddress = event.params.dataSource;
  dataProvider.owner = event.params.owner;
  dataProvider.stake = event.params.stake;
  dataProvider.status = "";
  dataProvider.tcdAddress = event.address;
  dataProvider.totalOwnership = event.params.stake;
  dataProvider.tcd = event.address.toHexString();
  dataProvider.dataProviderOwnerships = dpoKey;
  dataProvider.save();

  let dataProviderOwnership = new DataProviderOwnership(dpoKey);
  dataProviderOwnership.dataProvider = dPKey;
  dataProviderOwnership.dataSourceAddress = event.params.dataSource;
  dataProviderOwnership.tcdAddress = event.address;
  dataProviderOwnership.ownership = event.params.stake;
  dataProviderOwnership.tokenLock = event.params.stake;
  dataProviderOwnership.voter = event.params.owner;
  dataProviderOwnership.save();
}

export function handleDataSourceStaked(event: DataSourceStaked): void {
  updateProvider(event.address, event.params.dataSource, event.params.participant);
}

export function handleDataSourceUnstaked(event: DataSourceUnstaked): void {
  updateProvider(event.address, event.params.dataSource, event.params.participant);
}

export function handleFeeDistributed(event: FeeDistributed): void {
  let dPKey = event.params.dataSource.toHexString() + "-" + event.address.toHexString();
  let dataProvider = DataProvider.load(dPKey);

  updateProvider(event.address, event.params.dataSource, dataProvider.owner);
}

export function handleWithdrawReceiptCreated(event: WithdrawReceiptCreated): void {}

export function handleWithdrawReceiptUnlocked(event: WithdrawReceiptUnlocked): void {}

export function handleQuery(event: Query): void {
  let tcd = TCD.load(event.address.toHexString());

  if (tcd == null) {
    tcd = new TCD(event.address.toHexString());

    tcd.queryCount = 0;
    tcd.reportCount = 0;
  }
  tcd.queryCount = tcd.queryCount + 1;
  tcd.save();

  let hourInterval = event.block.timestamp.div(BigInt.fromI32(3600));
  let startTime = hourInterval.times(BigInt.fromI32(3600));

  let key = event.address.toHexString() + "/" + hourInterval.toString();
  let counter = QueryCounter.load(key);
  if (counter === null) {
    counter = new QueryCounter(key);
    counter.startTime = startTime;
    counter.query = 0;
    counter.contract = event.address;
  }

  counter.query = counter.query + 1;
  counter.save();
}
