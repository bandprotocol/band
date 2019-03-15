pragma solidity 0.5.0;

/**
 * @title Feeless
 */
contract Feeless {
  address public execDelegator;

  /**
   * @dev A modifier to be used for every function that can be called feelessly.
   * Function must have `sender` as the first argument, and this modifer guarantees
   * that the sender argument can be used safely. That is, either the function is called
   * directly by the sender or is called by the authorized execDelegator.
   */
  modifier feeless(address sender) {
    if (msg.sender != execDelegator) {
      require(sender == msg.sender);
    }
    _;
  }

  /**
   * @dev Sets the state variable execDelegator. Can only be set once.
   */
  function setExecDelegator(address _execDelegator) public {
    require(execDelegator == address(0));
    execDelegator = _execDelegator;
  }
}