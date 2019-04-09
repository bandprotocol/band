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
    uint256 nonce,
    bytes4 funcInterface
  );

  /**
  * @dev Keep track nonce of each user
  */
  mapping (address => uint256) public execNonces;

  /**
  * @dev Verify that the signature of sender is consistent with nonce and data
  */
  function verify(address sender, uint256 nonce, bytes memory data, bytes memory sig)
    internal
    pure
    returns (bool)
  {
    bytes32 hash = ECDSA.toEthSignedMessageHash(
      keccak256(abi.encodePacked(nonce, data))
    );
    return sender == ECDSA.recover(hash, sig);
  }

  /**
  * @dev Perform delegated execution
  * @param sender The address that wants to send this transaction feelessly
  * @param to Address of contract that the sender wants to call
  * @param funcInterface Signature of the function in the contract "to" to call
  * @param data Bytes-encoded arguments of the function, excluding the first parameter (sender)
  * @param senderSig Signature of user for (nonce, data)
  */
  function sendDelegatedExecution(
    address sender,
    address to,
    bytes4 funcInterface,
    bytes memory data,
    bytes memory senderSig
  ) public {
    uint256 nonce = execNonces[sender];
    require(verify(sender, nonce, data, senderSig));
    execNonces[sender] = nonce.add(1);
    (bool ok,) = to.call(abi.encodePacked(funcInterface,uint256(sender),data));
    require(ok);
    emit SendDelegatedExecution(msg.sender, sender, to, nonce, funcInterface);
  }
}
