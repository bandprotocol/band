pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

/**
 * @title ExecutionDelegator
 * @dev Allows trustless delegated execution of transactions.
 */
contract ExecutionDelegator {
  using SafeMath for uint256;

  event SendDelegatedExecution(
    address indexed relayer,
    address indexed sender,
    address indexed to,
    uint256 msTime,
    bytes4 funcInterface
  );

  // Mapping from address to lastMsTime of delegated execution
  mapping (address => uint256) public lastMsTimes;

  /**
  * @dev Verify that the signature of sender is consistent with time and data
  */
  function verify(address sender, uint256 time, bytes memory data, bytes memory sig)
    internal pure
    returns (bool)
  {
    bytes32 hash = ECDSA.toEthSignedMessageHash(
      keccak256(abi.encodePacked(time, data))
    );
    return sender == ECDSA.recover(hash, sig);
  }

  /**
  * @dev Perform delegated execution
  * @param sender The address that wants to send this transaction feelessly
  * @param to Address of contract that the sender wants to call
  * @param msTime Time at which the transaction is signed. Must not be older or newer than 1 hour
  * @param funcInterface Signature of the function in the contract "to" to call
  * @param data Bytes-encoded arguments of the function, excluding the first parameter (sender)
  * @param senderSig Signature of user for (time, data)
  */
  function sendDelegatedExecution(
    address sender,
    address to,
    bytes4 funcInterface,
    uint256 msTime,
    bytes memory data,
    bytes memory senderSig
  ) public {
    uint256 lastMsTime = lastMsTimes[sender];
    require(msTime > lastMsTime);
    require(msTime > now.sub(3600).mul(1000)); // Must not be older than 1 hour
    require(msTime < now.add(3600).mul(1000)); // Must not be newer than 1 hour
    require(verify(sender, msTime, data, senderSig));
    lastMsTimes[sender] = msTime;
    (bool ok,) = to.call(abi.encodePacked(funcInterface,  uint256(sender), data));
    require(ok);
    emit SendDelegatedExecution(msg.sender, sender, to, msTime, funcInterface);
  }
}
