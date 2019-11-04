import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Tx } from "../generated/schema";

export function saveTx(txHash: Bytes, confirmAt: BigInt): void {
  let txHashString = txHash.toHexString();
  let tx = Tx.load(txHashString);
  if (tx === null) {
    tx = new Tx(txHashString);
    tx.confirmAt = confirmAt;
    tx.save();
  }
}
