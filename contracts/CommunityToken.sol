pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./feeless/Feeless.sol";

/**
 * @title CommunityToken
 *
 * @dev Template for community token in Band ecosystem. It is essentially an
 * ERC20 contract with the ability for the "owner" to mint or burn tokens.
 * The owner will be the community's core contract after it is deployed.
 * Additionally, the contract has builtin voting power features, including
 * vote delegation and historical power tracking.
 */
contract CommunityToken is IERC20, Ownable, Feeless {
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
   * list of ALL historical changes of voting power.
   *
   * For instance, if an address has the following balance list:
   *  (0, 0) -> (13, 100) -> (14, 90) -> (16, 95)
   * It means the historical voting power of the address is:
   *    [at nonce=13] Receive 100 voting power
   *    [at nonce=14] Lose 10 voting power
   *    [at nonce=16] Receive 5 voting power
   *
   * Voting power of A can change if either:
   *  1. A new address chooses A as his delegator.
   *  2. One of A's delegating members decide to stop the delegation.
   *  3. One of A's delegating members balance changes.
   *
   * This allows the contract to figure out voting power of the address at any
   * nonce `n`, by searching for the node that has the biggest nonce
   * that is not greater than `n`.
   *
   * For efficiency, nonce and power are packed into one uint256 integer,
   * with the top 64 bits representing nonce, and the bottom 192 bits
   * representing voting power.
   */
  mapping (address => mapping(uint256 => uint256)) _votingPower;
  mapping (address => uint256) public votingPowerChangeCount;

  // The ID of the next voting update.
  uint256 public votingPowerChangeNonce = 0;

  modifier updatevotingPowerChangeNonce(){
    votingPowerChangeNonce = votingPowerChangeNonce.add(1);
    _;
  }

  // Mapping of voting delegator. All voting power of an address is
  // automatically transfered to to its delegator, until delegation is revoked.
  // Map to address(0) if an address is the delegator of itself.
  mapping (address => address) delegators;

  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals
  )
    public
  {
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
   * @dev Returns user voting power at the given index, that is, as of the
   * user's index^th voting power change
   */
  function historicalVotingPowerAtIndex(address owner, uint256 index)
    public
    view
    returns (uint256)
  {
    require(index <= votingPowerChangeCount[owner]);
    return _votingPower[owner][index] & ((1 << 192) - 1);  // Lower 192 bits
  }

  /**
   * @dev Returns user voting power at the given time. Under the hood, this
   * performs binary search to look for the largest index at which the
   * nonce is not greater than 'nonce'. The voting power at that index is
   * the returning value.
   */
  function historicalVotingPowerAtNonce(address owner, uint256 nonce)
    public
    view
    returns (uint256)
  {
    require(nonce <= votingPowerChangeNonce);
    require(nonce < (1 << 64));

    uint256 start = 0;
    uint256 end = votingPowerChangeCount[owner];

    // The gas cost of this binary search is approximately 200 * log2(lastNonce)
    while (start < end) {
      // Doing ((start + end + 1) / 2) here to prevent infinite loop.
      uint256 mid = start.add(end).add(1).div(2);
      if ((_votingPower[owner][mid] >> 192) > nonce) { // Upper 64 bits nonce
        // If midTime > nonce, this mid can't possibly be the answer
        end = mid.sub(1);
      } else {
        // Otherwise, search on the greater side, but still keep mid as a
        // possible option.
        start = mid;
      }
    }

    // Double check again that the binary search is correct.
    assert((_votingPower[owner][start] >> 192) <= nonce);
    if (start < votingPowerChangeCount[owner]) {
      assert((_votingPower[owner][start + 1] >> 192) > nonce);
    }

    return historicalVotingPowerAtIndex(owner, start);
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
    return historicalVotingPowerAtIndex(owner, votingPowerChangeCount[owner]);
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
  function delegateVote(address sender, address delegator)
    public
    feeless(sender)
    updatevotingPowerChangeNonce
    returns (bool)
  {
    require(delegatorOf(sender) == sender);
    require(delegator != sender);
    // Update delegator of this sender
    delegators[sender] = delegator;
    // Update voting power of involved parties
    uint256 balance = balanceOf(sender);
    _changeVotingPower(sender, votingPowerOf(sender).sub(balance));
    _changeVotingPower(delegator, votingPowerOf(delegator).add(balance));
    emit Delegate(sender, delegator);
    return true;
  }

  /**
   * @dev Revoke voting power delegation from the previously assigned delegator.
   */
  function revokeDelegateVote(address sender, address previousDelegator)
    public
    feeless(sender)
    updatevotingPowerChangeNonce
    returns (bool)
  {
    require(delegatorOf(sender) == previousDelegator);
    require(previousDelegator != sender);
    // Update delegator of this sender
    delegators[sender] = address(0);
    // Update voting power of involved parties
    uint256 balance = balanceOf(sender);
    _changeVotingPower(sender, votingPowerOf(sender).add(balance));
    _changeVotingPower(previousDelegator, votingPowerOf(previousDelegator).sub(balance));
    emit Delegate(sender, address(0));
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
   * @dev Similar to transfer, with extra parameter sender.
   */
  function transferFeeless(address sender, address to, uint256 value)
    public
    feeless(sender)
    returns (bool)
  {
    _transfer(sender, to, value);
    return true;
  }

  /**
   * @dev Transfer tokens and call the reciver's given function with supplied data.
   */
  function transferAndCall(
    address sender,
    address to,
    uint256 value,
    bytes4 sig,
    bytes calldata data
  )
    external
    feeless(sender)
    returns (bool)
  {
    _transfer(sender, to, value);
    (bool success,) = to.call(abi.encodePacked(sig, uint256(sender), value, data));
    require(success);
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
  function _transfer(address from, address to, uint256 value)
    internal
    updatevotingPowerChangeNonce
  {
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
  function _mint(address account, uint256 amount)
    internal
    updatevotingPowerChangeNonce
  {
    require(account != address(0));
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
  function _burn(address account, uint256 amount)
    internal
    updatevotingPowerChangeNonce
  {
    require(account != address(0));
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
    // Update `_balances` with new balance.
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
    uint256 currentIndex = votingPowerChangeCount[owner];

    require(newPower < (1 << 192));
    require(votingPowerChangeNonce < (1 << 64));

    // Update index of owner address
    currentIndex = currentIndex.add(1);
    votingPowerChangeCount[owner] = currentIndex;

    // Append new voting power at this eventNonce
    _votingPower[owner][currentIndex] = (votingPowerChangeNonce << 192) | newPower;
    emit VotingPowerUpdate(owner, newPower);
  }
}
