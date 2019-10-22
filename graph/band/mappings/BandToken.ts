import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  BandToken,
  Transfer as TransferEvent
} from "../generated/BandToken/BandToken";
import {
  Token,
  Balance,
  Transfer as TransferEntity
} from "../generated/schema";

const origin = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: TransferEvent): void {
  let token = Token.load(event.address.toHexString());

  if (token == null) {
    token = new Token(event.address.toHexString());
    let contract = BandToken.bind(event.address);
    token.totalSupply = contract.totalSupply();
    token.name = contract.name();
    token.symbol = contract.symbol();
    token.decimals = contract.decimals();
    token.holderCount = 0;
  }

  if (event.params.from.toHexString() != origin) {
    let key = "Band:" + event.params.from.toHexString();
    let fromBalance = Balance.load(key);

    if (fromBalance == null) {
      fromBalance = new Balance(key);
      fromBalance.token = token.id;
      fromBalance.user = event.params.from;
      fromBalance.value = BigInt.fromI32(0);
      fromBalance.lockedValue = BigInt.fromI32(0);
      token.holderCount = token.holderCount + 1;
    }

    fromBalance.value = fromBalance.value.minus(event.params.value);
    if (fromBalance.value.equals(BigInt.fromI32(0))) {
      store.remove("Balance", key);
      token.holderCount = token.holderCount - 1;
    } else {
      fromBalance.save();
    }
  }

  if (event.params.to.toHexString() != origin) {
    let key = "Band:" + event.params.to.toHexString();
    let toBalance = Balance.load(key);

    if (toBalance == null) {
      toBalance = new Balance(key);
      toBalance.token = token.id;
      toBalance.user = event.params.to;
      toBalance.value = BigInt.fromI32(0);
      toBalance.lockedValue = BigInt.fromI32(0);
      token.holderCount = token.holderCount + 1;
    }

    toBalance.value = toBalance.value.plus(event.params.value);
    toBalance.save();
  }
  token.save();

  let transferKey =
    event.block.number.toString() + "@" + event.logIndex.toString();
  let transfer = TransferEntity.load(transferKey);
  if (transfer !== null) return;
  transfer = new TransferEntity(transferKey);
  transfer.token = token.id;
  transfer.blockHeight = event.block.number.toI32();
  transfer.logIndex = event.logIndex.toI32();
  transfer.sender = event.params.from;
  transfer.receiver = event.params.to;
  transfer.value = event.params.value;
  transfer.timestamp = event.block.timestamp;
  transfer.txHash = event.transaction.hash;

  transfer.save();
}
