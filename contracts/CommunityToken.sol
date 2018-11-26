pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


/**
 * @title CommunityToken
 *
 * @dev Template for community token in Band ecosystem. It is essentially an
 * ERC20 contract with the ability for the "owner" to mint or burn tokens.
 * The owner will be the community's core contract after it is deployed.
 * Additionally, the contract has builtin voting power features, including
 * vote delegation and historical power tracking.
 */
contract CommunityToken is IERC20, Ownable {
  using SafeMath for uint256;

  // `owner` chooses to delegate its voting power to `delegator`. Delegator
  // is address(0) if owner chooses to revoke previous delegation.
  event Delegate(
    address indexed owner,
    address indexed delegator
  );

  event VotingPowerUpdate(
    address indexed owner,
    uint256 votingPower
  );

  string public name;
  string public symbol;
  uint256 public decimals;

  uint256 private _totalSupply;

  mapping (address => uint256) _balances;
  // Amount of tokens allowed in transferFrom, similar to ERC-20 standard.
  mapping (address => mapping (address => uint256)) _allowed;

  /**
   * @dev IMPORTANT: voting in CommunityToken are kept as a linked
   * list of ALL historical changes of voting power in block number and power.
   *
   * For instance, if an address has the following balance list:
   *  (0, 0) -> (1000, 100) -> (1010, 90) -> (1020, 95)
   * It means the historical voting power of the address is:
   *    [at height=1000] Receive 100 voting power
   *    [at height=1010] Lose 10 voting power
   *    [at height=1020] Receive 5 voting power
   *
   * Voting power of A can change if either:
   *  1. A new address chooses A as his delegator.
   *  2. One of A's delegating members decide to stop the delegation.
   *  3. One of A's delegating members balance changes.
   * If multiple changes occur at the same block, only the last one will be
   * kept on the linked list data structure.
   *
   * This allows the contract to figure out voting power of the address at any
   * blockno `t`, by searching for the node that has the biggest blockno
   * that is not greater than `t`.
   *
   * For efficiency, blockno and power are packed into one uint256 integer,
   * with the top 64 bits representing blockno, and the bottom 192 bits
   * representing voting power.
   */
  mapping (address => mapping(uint256 => uint256)) _votingPower;
  mapping (address => uint256) public votingPowerNonces;

  // Mapping of voting delegator. All voting power of an address is
  // automatically transfered to to its delegator, until delegation is revoked.
  // Map to address(0) if an address is the delegator of itself.
  mapping (address => address) delegators;


  constructor(string _name, string _symbol, uint8 _decimals) public {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
  }

  /**
   * @dev Returns total number of tokens in existence
   */
  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  /**
   * @dev Returns user voting power at the given nonce, that is, as of the
   * user's nonce^th voting power change
   */
  function historicalVotingPowerAtNonce(address owner, uint256 nonce)
    public
    view
    returns (uint256)
  {
    require(nonce <= votingPowerNonces[owner]);
    return _votingPower[owner][nonce] & ((1 << 192) - 1);  // Lower 192 bits
  }

  /**
   * @dev Returns user voting power at the given time. Under the hood, this
   * performs binary search to look for the largest nonce at which the
   * blockno is not greater than 'blockno'. The voting power at that nonce is
   * the returning value.
   */
  function historicalVotingPowerAtBlock(address owner, uint256 blockno)
    public
    view
    returns (uint256)
  {
    // Data in the current block is not yet finalized. This method only works
    // for past blocks.
    require(blockno < block.number);
    require(blockno < (1 << 64));

    uint256 start = 0;
    uint256 end = votingPowerNonces[owner];

    // The gas cost of this binary search is approximately 200 * log2(lastNonce)
    while (start < end) {
      // Doing ((start + end + 1) / 2) here to prevent infinite loop.
      uint256 mid = start.add(end).add(1).div(2);
      if ((_votingPower[owner][mid] >> 192) > blockno) { // Upper 64 bits blockno
        // If midTime > blockno, this mid can't possibly be the answer
        end = mid.sub(1);
      } else {
        // Otherwise, search on the greater side, but still keep mid as a
        // possible option.
        start = mid;
      }
    }

    // Double check again that the binary search is correct.
    assert((_votingPower[owner][start] >> 192) <= blockno);
    if (start < votingPowerNonces[owner]) {
      assert((_votingPower[owner][start + 1] >> 192) > blockno);
    }

    return historicalVotingPowerAtNonce(owner, start);
  }

  /**
   * @dev Gets the voting delegator of the specified address.
   */
  function delegatorOf(address owner) public view returns (address) {
    address delegator = delegators[owner];
    if (delegator == address(0)) {
      // If no mapping is specified, then it is the delegator of itself
      return owner;
    }
    return delegator;
  }

  /**
   * @dev Gets the current voting power of the specified address.
   */
  function votingPowerOf(address owner) public view returns (uint256) {
    return historicalVotingPowerAtNonce(owner, votingPowerNonces[owner]);
  }

  /**
   * @dev Gets the current balance of the specified address.
   * @param owner The address to query the the balance of.
   * @return An uint256 representing the amount owned by the passed address.
   */
  function balanceOf(address owner) public view returns (uint256) {
    return _balances[owner];
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param owner address The address which owns the funds.
   * @param spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(address owner, address spender)
    public
    view
    returns (uint256)
  {
    return _allowed[owner][spender];
  }

  /**
   * @dev Assign the given delegator to the transaction sender. The delegator
   * can vote on this account's behalf. Note that delegator assignments are
   * NOT recursive.
   */
  function delegateVote(address delegator) public returns (bool) {
    require(delegatorOf(msg.sender) == msg.sender);
    require(delegator != msg.sender);
    // Update delegator of this sender
    delegators[msg.sender] = delegator;
    // Update voting power of involved parties
    uint256 balance = balanceOf(msg.sender);
    _changeVotingPower(msg.sender, votingPowerOf(msg.sender).sub(balance));
    _changeVotingPower(delegator, votingPowerOf(delegator).add(balance));

    emit Delegate(msg.sender, delegator);
    return true;
  }

  /**
   * @dev TODO
   */
  function revokeDelegateVote(address previousDelegator) public returns (bool) {
    require(delegatorOf(msg.sender) == previousDelegator);
    require(previousDelegator != msg.sender);
    // Update delegator of this sender
    delegators[msg.sender] = address(0);
    // Update voting power of involved parties
    uint256 balance = balanceOf(msg.sender);
    _changeVotingPower(msg.sender, votingPowerOf(msg.sender).add(balance));
    _changeVotingPower(
      previousDelegator, votingPowerOf(previousDelegator).sub(balance));

    emit Delegate(msg.sender, address(0));
    return true;
  }

  /**
   * @dev Transfer token for a specified address
   * @param to The address to transfer to.
   * @param value The amount to be transferred.
   */
  function transfer(address to, uint256 value) public returns (bool) {
    _transfer(msg.sender, to, value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param spender The address which will spend the funds.
   * @param value The amount of tokens to be spent.
   */
  function approve(address spender, uint256 value) public returns (bool) {
    require(spender != address(0));

    _allowed[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  /**
   * @dev Similar to Approve, but for multiple addresses at once. This function
   * is useful for approving all community-related contracts to withdraw tokens
   * on user's behalf.
   */
  function batchApprove(address[] spenders, uint256 value)
    public
    returns (bool)
  {
    for (uint256 idx = 0; idx < spenders.length; ++idx) {
      require(approve(spenders[idx], value));
    }
    return true;
  }

  /**
   * @dev Transfer tokens from one address to another
   * @param from address The address which you want to send tokens from
   * @param to address The address which you want to transfer to
   * @param value uint256 the amount of tokens to be transferred
   */
  function transferFrom(
    address from,
    address to,
    uint256 value
  )
    public
    returns (bool)
  {
    require(value <= _allowed[from][msg.sender]);

    _allowed[from][msg.sender] = _allowed[from][msg.sender].sub(value);
    _transfer(from, to, value);
    return true;
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed_[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param spender The address which will spend the funds.
   * @param addedValue The amount of tokens to increase the allowance by.
   */
  function increaseAllowance(
    address spender,
    uint256 addedValue
  )
    public
    returns (bool)
  {
    require(spender != address(0));

    _allowed[msg.sender][spender] = (
      _allowed[msg.sender][spender].add(addedValue));
    emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed_[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param spender The address which will spend the funds.
   * @param subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseAllowance(
    address spender,
    uint256 subtractedValue
  )
    public
    returns (bool)
  {
    require(spender != address(0));

    _allowed[msg.sender][spender] = (
      _allowed[msg.sender][spender].sub(subtractedValue));
    emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
    return true;
  }

  /**
   * @dev Mint token to the specified address for the given amount.
   */
  function mint(address account, uint256 amount)
    public
    onlyOwner
    returns (bool)
  {
    _mint(account, amount);
    return true;
  }

  /**
   * @dev Burn token from the specified address for the given amount.
   */
  function burn(address account, uint256 amount)
    public
    onlyOwner
    returns (bool)
  {
    _burn(account, amount);
    return true;
  }

  /**
   * @dev Transfer token for a specified addresses
   * @param from The address to transfer from.
   * @param to The address to transfer to.
   * @param value The amount to be transferred.
   */
  function _transfer(address from, address to, uint256 value) internal {
    require(value <= balanceOf(from));
    require(from != to);
    require(to != address(0));

    _changeBalance(from, balanceOf(from).sub(value));
    _changeBalance(to, balanceOf(to).add(value));

    emit Transfer(from, to, value);
  }

  /**
   * @dev Internal function that mints an amount of the token and assigns it to
   * an account. This encapsulates the modification of balances such that the
   * proper events are emitted.
   * @param account The account that will receive the created tokens.
   * @param amount The amount that will be created.
   */
  function _mint(address account, uint256 amount) internal {
    require(account != 0);

    _totalSupply = _totalSupply.add(amount);
    _changeBalance(account, balanceOf(account).add(amount));

    emit Transfer(address(0), account, amount);
  }

  /**
   * @dev Internal function that burns an amount of the token of a given
   * account.
   * @param account The account whose tokens will be burnt.
   * @param amount The amount that will be burnt.
   */
  function _burn(address account, uint256 amount) internal {
    require(account != 0);
    require(amount <= balanceOf(account));

    _totalSupply = _totalSupply.sub(amount);
    _changeBalance(account, balanceOf(account).sub(amount));

    emit Transfer(account, address(0), amount);
  }

  /**
   * @dev Change balance of the given account to a new value. The new balance
   * will be reflected both in `_balances` of this account and in `votingPower`
   * of this account's delegator.
   */
  function _changeBalance(address owner, uint256 newBalance) internal {
    uint256 oldBalance = balanceOf(owner);
    require(oldBalance != newBalance);

    // Update `_balances` with new balances
    _balances[owner] = newBalance;

    // Compute new voting power of the address's delegator (can be itself).
    address delegator = delegatorOf(owner);
    uint256 previousPower = votingPowerOf(delegator);
    uint256 newPower = previousPower.add(newBalance).sub(oldBalance);

    _changeVotingPower(delegator, newPower);
  }

  /**
   * @dev Change voting power of the given (potentially delegated) account
   * to a new value.
   */
  function _changeVotingPower(address owner, uint256 newPower) internal {
    uint256 currentBlockno = block.number;
    uint256 currentNonce = votingPowerNonces[owner];

    require(newPower < (1 << 192));
    require(currentBlockno < (1 << 64));

    if ((_votingPower[owner][currentNonce] >> 192) != currentBlockno) {
      // If the current blockno is not equal to the last one on the linked list,
      // we append a new entry to the list. Otherwise, we simply rewrite the
      // last node's power to newPower.
      currentNonce = currentNonce.add(1);
      votingPowerNonces[owner] = currentNonce;
    }

    _votingPower[owner][currentNonce] = (currentBlockno << 192) | newPower;
    emit VotingPowerUpdate(owner, newPower);
  }
}
