pragma solidity 0.5.8;


contract Feeless {
  address public execDelegator;

  /// A modifier for function to be called feelessly. Function must have `sender` as the first
  /// argument, and this modifer guarantees that the sender argument can be used safely. That is,
  /// either the function is called directly by the sender or by the authorized execDelegator.
  modifier feeless(address sender) {
    require(msg.sender == execDelegator || msg.sender == sender);
    _;
  }

  /// Sets the state variable execDelegator. Can only be set once.
  function setExecDelegator(address _execDelegator) public {
    require(execDelegator == address(0));
    execDelegator = _execDelegator;
  }
}
