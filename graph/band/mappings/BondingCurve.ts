import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  BondingCurve,
  Buy as BuyEvent,
  Sell as SellEvent,
  Deflate,
  RevenueCollect
} from "../generated/BondingCurve/BondingCurve";
import { Token, Curve, Order, Price } from "../generated/schema";
import { saveTx } from "./TxSubscriber";

function getOneToken(): BigInt {
  return BigInt.fromI32(1000000000).times(BigInt.fromI32(1000000000));
}
function findOrCreateToken(
  curveAddress: Address,
  tokenAddress: Address
): Token | null {
  let token = Token.load(tokenAddress.toHexString());
  if (token == null) {
    token = new Token(tokenAddress.toHexString());
  }
  token.curve = curveAddress.toHexString();
  return token;
}

function findOrCreateCurve(
  curveAddress: Address,
  tokenAddress: Address
): Curve | null {
  let curve = Curve.load(curveAddress.toHexString());
  if (curve == null) {
    let bondingContract = BondingCurve.bind(curveAddress);
    curve = new Curve(curveAddress.toHexString());
    curve.token = tokenAddress.toHexString();
    curve.price = BigInt.fromI32(0);
    curve.pricesCount = BigInt.fromI32(0);
    curve.collateralEquation = bondingContract.getCollateralExpression();
    curve.curveMultiplier = bondingContract.curveMultiplier();
  }
  return curve;
}

function addOrder(
  curveAddress: Address,
  owner: Address,
  orderType: string,
  blockNo: BigInt,
  logIndex: BigInt,
  amount: BigInt,
  price: BigInt,
  timestamp: BigInt,
  txHash: Bytes
): void {
  let bondingContract = BondingCurve.bind(curveAddress);
  let tokenAddress = bondingContract.bondedToken();
  let curve = findOrCreateCurve(curveAddress, tokenAddress);
  let token = findOrCreateToken(curveAddress, tokenAddress);
  let orderKey = blockNo.toString() + "@" + logIndex.toString();
  let order = Order.load(orderKey);
  if (order == null) {
    order = new Order(orderKey);
    order.curve = curve.id;
    order.blockHeight = blockNo.toI32();
    order.logIndex = logIndex.toI32();
    order.orderType = orderType;
    order.user = owner;
    order.amount = amount;
    order.price = price;
    order.timestamp = timestamp;
    order.txHash = txHash;
    order.save();
  }

  if (orderType == "Buy") {
    token.totalSupply = token.totalSupply.plus(amount);
  } else {
    token.totalSupply = token.totalSupply.minus(amount);
  }

  token.save();
  let tryPrice = bondingContract.try_getBuyPrice(getOneToken());

  if (!tryPrice.reverted) {
    let nextPrice = tryPrice.value;
    let priceKey = curve.id + "@" + timestamp.toString();
    let priceEntity = Price.load(priceKey);
    if (priceEntity == null) {
      priceEntity = new Price(priceKey);
      priceEntity.curve = curve.id;
      priceEntity.nonce = curve.pricesCount;
    }
    priceEntity.price = nextPrice;
    priceEntity.totalSupply = token.totalSupply;
    priceEntity.timestamp = timestamp;
    priceEntity.save();

    curve.price = nextPrice;
    curve.pricesCount = priceEntity.nonce.plus(BigInt.fromI32(1));
    curve.curveMultiplier = bondingContract.curveMultiplier();
  }
  curve.save();
}

export function handleBuy(event: BuyEvent): void {
  saveTx(event.transaction.hash, event.block.number);

  addOrder(
    event.address,
    event.params.buyer,
    "Buy",
    event.block.number,
    event.logIndex,
    event.params.bondedTokenAmount,
    event.params.collateralTokenAmount,
    event.block.timestamp,
    event.transaction.hash
  );
}

export function handleSell(event: SellEvent): void {
  saveTx(event.transaction.hash, event.block.number);

  addOrder(
    event.address,
    event.params.seller,
    "Sell",
    event.block.number,
    event.logIndex,
    event.params.bondedTokenAmount,
    event.params.collateralTokenAmount,
    event.block.timestamp,
    event.transaction.hash
  );
}

export function handleDeflate(event: Deflate): void {
  saveTx(event.transaction.hash, event.block.number);

  let bondingContract = BondingCurve.bind(event.address);
  let tokenAddress = bondingContract.bondedToken();
  let curve = findOrCreateCurve(event.address, tokenAddress);
  curve.curveMultiplier = bondingContract.curveMultiplier();
  curve.save();
  let token = findOrCreateToken(event.address, tokenAddress);
  token.totalSupply = token.totalSupply.minus(event.params.burnedAmount);
  token.save();
}

export function handleRevenueCollect(event: RevenueCollect): void {
  saveTx(event.transaction.hash, event.block.number);

  let bondingContract = BondingCurve.bind(event.address);
  let tokenAddress = bondingContract.bondedToken();
  let curve = findOrCreateCurve(event.address, tokenAddress);
  curve.curveMultiplier = bondingContract.curveMultiplier();
  curve.save();
  let token = findOrCreateToken(event.address, tokenAddress);
  token.totalSupply = token.totalSupply.plus(event.params.bondedTokenAmount);
  token.save();
}
