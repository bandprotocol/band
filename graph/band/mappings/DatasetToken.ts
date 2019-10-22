import { BigInt, store, Address } from "@graphprotocol/graph-ts";
import {
  DatasetToken,
  Transfer as TransferEvent,
  TokenLocked as TokenLockedEvent,
  TokenUnlocked
} from "../generated/DatasetToken/DatasetToken";
import {
  Token,
  Balance,
  Transfer as TransferEntity,
  TokenLocked as TokenLockedEntity
} from "../generated/schema";

const origin = "0x0000000000000000000000000000000000000000";

function findOrCreateToken(tokenAddress: Address): Token | null {
  let token = Token.load(tokenAddress.toHexString());

  if (token == null) {
    token = new Token(tokenAddress.toHexString());
    let contract = DatasetToken.bind(tokenAddress);
    token.totalSupply = BigInt.fromI32(0);
    token.name = contract.name();
    token.symbol = contract.symbol();
    token.decimals = contract.decimals();
    token.holderCount = 0;
  }

  return token;
}

export function handleTransfer(event: TransferEvent): void {
  let token = findOrCreateToken(event.address);
  let tokenAddress = token.id;

  if (event.params.from.toHexString() != origin) {
    let key = tokenAddress + ":" + event.params.from.toHexString();
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

  if (event.params.to.toHexString() != origin) {
    let key = tokenAddress + ":" + event.params.to.toHexString();
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
}

export function handleTokenLocked(event: TokenLockedEvent): void {
  let token = findOrCreateToken(event.address);
  let tokenLockKey =
    event.address.toHexString() +
    "@" +
    event.params.locker.toHexString() +
    "-" +
    event.params.owner.toHexString();
  let tokenLock = TokenLockedEntity.load(tokenLockKey);
  if (tokenLock == null) {
    tokenLock = new TokenLockedEntity(tokenLockKey);
    tokenLock.token = token.id;
    tokenLock.locker = event.params.locker;
    tokenLock.user = event.params.owner;
    tokenLock.value = BigInt.fromI32(0);
  }
  tokenLock.value = tokenLock.value.plus(event.params.value);
  tokenLock.save();

  let balanceKey =
    event.address.toHexString() + ":" + event.params.owner.toHexString();
  let balance = Balance.load(balanceKey);
  if (balance == null) {
    balance = new Balance(balanceKey);
    balance.token = token.id;
    balance.user = event.params.owner;
    balance.value = BigInt.fromI32(0);
    balance.lockedValue = tokenLock.value;
    token.holderCount = token.holderCount + 1;
  } else {
    balance.lockedValue = tokenLock.value;
  }

  balance.save();
  token.save();
}

export function handleTokenUnlocked(event: TokenUnlocked): void {
  let token = findOrCreateToken(event.address);
  let tokenLockKey =
    event.address.toHexString() +
    "@" +
    event.params.locker.toHexString() +
    "-" +
    event.params.owner.toHexString();
  let tokenLock = TokenLockedEntity.load(tokenLockKey);
  if (tokenLock == null) {
    tokenLock = new TokenLockedEntity(tokenLockKey);
    tokenLock.token = token.id;
    tokenLock.locker = event.params.locker;
    tokenLock.user = event.params.owner;
    tokenLock.value = BigInt.fromI32(0);
  }
  tokenLock.value = tokenLock.value.minus(event.params.value);
  tokenLock.save();

  let balanceKey =
    event.address.toHexString() + ":" + event.params.owner.toHexString();
  let balance = Balance.load(balanceKey);
  if (balance == null) {
    balance = new Balance(balanceKey);
    balance.token = token.id;
    balance.user = event.params.owner;
    balance.value = BigInt.fromI32(0);
    balance.lockedValue = tokenLock.value;
    token.holderCount = token.holderCount + 1;
  } else {
    balance.lockedValue = tokenLock.value;
  }

  balance.save();
  token.save();
}
