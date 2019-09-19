import { BigInt, crypto, ByteArray } from "@graphprotocol/graph-ts";
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
import { TCDContract, Report } from "../generated/schema";

export function handleDataUpdated(event: DataUpdated): void {
  let tcd = TCDContract.load(event.address.toHexString());

  if (tcd == null) {
    tcd = new TCDContract(event.address.toHexString());

    tcd.queryCount = 0;
    tcd.reportCount = 0;
  }

  tcd.reportCount = tcd.reportCount + 1;
  tcd.save();

  let key =
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

  let report = Report.load(key);
  if (report === null) {
    report = new Report(key);
    report.key = event.params.key;
    report.value = event.params.value;
    report.timestamp = event.params.timestamp;
    report.status = event.params.status;
    report.txHash = event.transaction.hash;
    report.save();
  }
}

export function handleDataSourceRegistered(event: DataSourceRegistered): void {}

export function handleDataSourceStaked(event: DataSourceStaked): void {}

export function handleDataSourceUnstaked(event: DataSourceUnstaked): void {}

export function handleFeeDistributed(event: FeeDistributed): void {}

export function handleWithdrawReceiptCreated(
  event: WithdrawReceiptCreated
): void {}

export function handleWithdrawReceiptUnlocked(
  event: WithdrawReceiptUnlocked
): void {}

export function handleQuery(event: Query): void {
  let tcd = TCDContract.load(event.address.toHexString());

  if (tcd == null) {
    tcd = new TCDContract(event.address.toHexString());

    tcd.queryCount = 0;
    tcd.reportCount = 0;
  }
  tcd.queryCount = tcd.queryCount + 1;
  tcd.save();
}
