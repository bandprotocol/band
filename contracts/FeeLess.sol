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
  * @dev A function for setting the state variable execDelegator.
  * If there is no execDelegator then anyone can set execDelegator is himself.
  * If there is an existing execDelegator then only him can use this function.
  * @param nextExecDelegator address of new execDelegator
  */
  function setExecDelegator(address nextExecDelegator) public {
    require(
      execDelegator == address(0)||
      msg.sender == execDelegator
    );
    execDelegator = nextExecDelegator;
  }
}