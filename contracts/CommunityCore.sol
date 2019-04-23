pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

import "./bonding/ParameterizedBondingCurve.sol";
import "./token/ERC20Interface.sol";

import "./BandToken.sol";
import "./CommunityToken.sol";
import "./ParametersBase.sol";

/**
 * @title CommunityCore
 *
 * @dev Community Core contract keeps custody of community reward pool. It
 * allows community admins to report per period reward distribution. Anyone
 * can send transaction here to withdraw rewards. Community Core contract also
 * acts as the automated market maker, allowing anyone to buy/sell community
 * token with itself.
 */
contract CommunityCore {
  BandToken public bandToken;
  CommunityToken public commToken;
  ParametersBase public params;
  ParameterizedBondingCurve public bondingCurve;

  /**
   * @dev Create community core contract.
   */
  constructor(
    BandToken _bandToken,
    CommunityToken _commToken,
    ParametersBase _params,
    uint256[] memory _expressions
  )
    public
  {
    bandToken = _bandToken;
    commToken = _commToken;
    params = _params;
    bondingCurve = new ParameterizedBondingCurve(
      ERC20Interface(address(_bandToken)),
      ERC20Interface(address(_commToken)),
      _expressions,
      _params
    );
  }
}
