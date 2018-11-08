pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


/**
 * @title CommunityToken
 *
 * @dev Template for community token in Band ecosystem. It is essentially an
 * ERC20 contract with the ability for the "owner" to mint or burn tokens.
 * The owner will be the community's core contract after it is deployed.
 * Additionally, this contract keeps track of every user's historical balance
 * to help prevent double voting in Parameters and TCR contracts.
 */
contract CommunityToken is IERC20, Ownable {
  using SafeMath for uint256;

  string public name;
  string public symbol;
  uint256 public decimals;

  mapping (address => mapping (uint256 => uint256)) _balances;

  mapping (address => uint256) _nonces;

  mapping (address => mapping (address => uint256)) _allowed;

  uint256 private _totalSupply;


  constructor(string _name, string _symbol, uint8 _decimals) public {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
  }

  /**
   * @dev Total number of tokens in existence
   */
  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  /**
   * @dev Returns user balance at the given nonce, that is, as of the user's
   * nonce^th balance change
   */
  function historicalBalanceAtNonce(address owner, uint256 nonce)
    public
    view
    returns (uint256)
  {
    require(nonce <= _nonces[owner]);
    return _balances[owner][nonce] & ((1 << 192) - 1);  // Lower 192 bits
  }

  /**
   * @dev Returns the timestamp of user balance at the given nonce.
   */
  function historicalTimeAtNonce(address owner, uint256 nonce)
    public
    view
    returns (uint256)
  {
    require(nonce <= _nonces[owner]);
    return _balances[owner][nonce] >> 192;  // Lower 64 bits
  }

  /**
   * @dev Returns user balance at the given time. Note that for performance
   * reason, this function also takes the nonce that is expected to reflect
   * the answer. If called with zero nonce, the function will fall back to
   * the slow variant.
   */
  function historicalBalanceAtTime(
    address owner,
    uint256 asof,
    uint256 nonce
  )
    public
    view
    returns (uint256)
  {
    if (nonce == 0) {
      return historicalBalanceAtTimeSlow(owner, asof);
    }

    // The balance record must happen at or before the as-of time.
    require(historicalTimeAtNonce(owner, nonce) <= asof);

    // The next balance record, if exists, must happen after the as-of time.
    if (nonce < _nonces[owner]) {
      require(historicalTimeAtNonce(owner, nonce + 1) > asof);
    }

    return historicalBalanceAtNonce(owner, nonce);
  }

  /**
   * @dev Similar to above, but does binary search to look for nonce without
   * the need to provide one. This is less efficient than the non-slow one.
   */
  function historicalBalanceAtTimeSlow(address owner, uint256 asof)
    public
    view
    returns (uint256)
  {
    uint256 start = 0;
    uint256 end = _nonces[owner];

    while (start < end) {
      // Doing ((start + end + 1) / 2) here to prevent infinite loop.
      uint256 mid = start.add(end).add(1).div(2);
      if (historicalTimeAtNonce(owner, mid) > asof) {
        // If midTime > asof, this mid can't possibly be the answer
        end = mid.sub(1);
      } else {
        // Otherwise, search on the greater side, but still keep mid as option
        start = mid;
      }
    }

    // Double check again that the binary search is correct.
    assert(historicalTimeAtNonce(owner, start) <= asof);
    if (start < _nonces[owner]) {
      assert(historicalTimeAtNonce(owner, start + 1) > asof);
    }

    return historicalBalanceAtNonce(owner, start);
  }

  /**
   * @dev Gets the current balance of the specified address.
   * @param owner The address to query the the balance of.
   * @return An uint256 representing the amount owned by the passed address.
   */
  function balanceOf(address owner) public view returns (uint256) {
    return historicalBalanceAtNonce(owner, _nonces[owner]);
  }

  /**
   * @dev Returns the latest nonce of the specified address.
   */
  function latestNonce(address owner) public view returns (uint256) {
    return _nonces[owner];
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

    _addBalance(from, balanceOf(from).sub(value));
    _addBalance(to, balanceOf(to).add(value));

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
    _addBalance(account, balanceOf(account).add(amount));

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
    _addBalance(account, balanceOf(account).sub(amount));

    emit Transfer(account, address(0), amount);
  }

  /**
   * @dev Add new balance to the given account. The added balance will be
   * paired with current block timestamp.
   */
  function _addBalance(address owner, uint256 balance) internal {
    uint256 currentTime = block.timestamp;

    require(balance < (1 << 192));
    require(currentTime < (1 << 64));

    uint256 nonce = _nonces[owner] + 1;
    _balances[owner][nonce] = (currentTime << 192) | balance;
    _nonces[owner] = nonce;
  }
}
