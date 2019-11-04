import {
  BigInt,
  Address,
  store,
  BigDecimal,
  Bytes
} from "@graphprotocol/graph-ts";
import {
  Parameters as ParameterContract,
  ProposalProposed,
  ParameterChanged,
  ParameterProposed,
  ProposalVoted,
  ProposalAccepted,
  ProposalRejected
} from "../generated/Parameters/Parameters";

import {
  Token,
  Curve,
  Parameter,
  Proposal as ProposalEntity,
  ParameterKV,
  ProposalKV,
  ProposalVote as ProposalVoteEntity
} from "../generated/schema";
import { DatasetToken } from "../generated/DatasetToken/DatasetToken";
import { saveTx } from "./TxSubscriber";

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

function findOrCreateParameter(parameterAddress: Address): Parameter | null {
  let parameter = Parameter.load(parameterAddress.toHexString());
  if (parameter == null) {
    let parameterContract = ParameterContract.bind(parameterAddress);
    parameter = new Parameter(parameterAddress.toHexString());
    let tokenAddress = parameterContract.token();
    parameter.token = tokenAddress.toHexString();

    let token = findOrCreateToken(tokenAddress);
    token.parameter = parameterAddress.toHexString();
    token.save();
    parameter.save();
  }
  return parameter;
}

export function handleParameterChanged(event: ParameterChanged): void {
  saveTx(event.transaction.hash, event.block.number);

  let parameter = findOrCreateParameter(event.address);
  let stringKey = event.params.key.toString();
  let newParam = ParameterKV.load(event.address.toHexString() + stringKey);
  if (newParam == null) {
    newParam = new ParameterKV(event.address.toHexString() + stringKey);
    newParam.parameter = parameter.id;
    newParam.key = stringKey;
  }
  newParam.value = event.params.value;
  newParam.save();

  if (stringKey == "bonding:curve_expression") {
    let token = findOrCreateToken(Address.fromString(parameter.token));
    let curve = Curve.load(token.curve);
    if (curve == null) {
      curve = new Curve(token.curve);
    }

    let cEqAddr = event.params.value.toHexString();
    if (cEqAddr.length < 42) {
      cEqAddr = "0x" + cEqAddr.substr(2).padStart(40, "0");
    } else if (cEqAddr.length > 42) {
      cEqAddr = "0x" + cEqAddr.substr(cEqAddr.length - 40);
    }
    curve.collateralEquation = Address.fromString(cEqAddr);
    curve.save();
  }
}

export function handleProposalProposed(event: ProposalProposed): void {
  saveTx(event.transaction.hash, event.block.number);

  let parameter = findOrCreateParameter(event.address);
  let parameterContract = ParameterContract.bind(event.address);
  let proposal = parameterContract.proposals(event.params.proposalId);
  let proposalEntity = ProposalEntity.load(
    event.address.toHexString() + event.params.proposalId.toHexString()
  );
  if (proposalEntity == null) {
    proposalEntity = new ProposalEntity(
      event.address.toHexString() + event.params.proposalId.toHexString()
    );
    proposalEntity.parameter = event.address.toHexString();
    proposalEntity.proposalId = event.params.proposalId.toI32();
    proposalEntity.proposer = event.params.proposer.toHexString();
    proposalEntity.reasonHash = event.params.reasonHash;
    proposalEntity.changes = [];
    proposalEntity.tokenSnapShot = proposal.value1.toI32();
    proposalEntity.expirationTime = proposal.value2.toI32();
    proposalEntity.supportRequired = proposal.value3;
    proposalEntity.minParticipation = proposal.value4;
    proposalEntity.totalVotingPower = proposal.value5;
    proposalEntity.currentYesCount = new BigInt(0);
    proposalEntity.currentNoCount = new BigInt(0);
    proposalEntity.status = "ACTIVE";
    proposalEntity.timestamp = event.block.timestamp.toI32();
    proposalEntity.txHash = event.transaction.hash;
    proposalEntity.save();
  }
}

export function handleParameterProposed(event: ParameterProposed): void {
  saveTx(event.transaction.hash, event.block.number);

  let proposal = ProposalEntity.load(
    event.address.toHexString() + event.params.proposalId.toHexString()
  );
  let proposalKv = new ProposalKV(
    event.address.toHexString() +
      event.params.proposalId.toHexString() +
      event.params.key.toHexString()
  );
  proposalKv.proposal =
    event.address.toHexString() + event.params.proposalId.toHexString();
  proposalKv.key = event.params.key.toString();
  proposalKv.value = event.params.value;
  proposalKv.save();
}

export function handleProposalVoted(event: ProposalVoted): void {
  saveTx(event.transaction.hash, event.block.number);

  let proposal = ProposalEntity.load(
    event.address.toHexString() + event.params.proposalId.toHexString()
  );

  if (event.params.vote) {
    proposal.currentYesCount = proposal.currentYesCount.plus(
      event.params.votingPower
    );
  } else {
    proposal.currentNoCount = proposal.currentNoCount.plus(
      event.params.votingPower
    );
  }

  let newVoted = new ProposalVoteEntity(
    event.address.toHexString() +
      event.params.proposalId.toHexString() +
      event.params.voter.toHexString()
  );
  newVoted.proposal = proposal.id;
  newVoted.voter = event.params.voter.toHexString();
  newVoted.accepted = event.params.vote;
  newVoted.txHash = event.transaction.hash;
  newVoted.timestamp = event.block.timestamp.toI32();

  newVoted.save();
  proposal.save();
}

export function handleProposalAccepted(event: ProposalAccepted): void {
  saveTx(event.transaction.hash, event.block.number);

  let proposal = ProposalEntity.load(
    event.address.toHexString() + event.params.proposalId.toHexString()
  );
  proposal.status = "APPROVED";
  proposal.save();
}

export function handleProposalRejected(event: ProposalRejected): void {
  saveTx(event.transaction.hash, event.block.number);

  let proposal = ProposalEntity.load(
    event.address.toHexString() + event.params.proposalId.toHexString()
  );
  proposal.status = "REJECTED";
  proposal.save();
}
