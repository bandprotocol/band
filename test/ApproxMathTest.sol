pragma solidity ^0.4.23;

import "truffle/Assert.sol";

import "../contracts/ApproxMath.sol";


contract ApproxMathTest {

  using ApproxMath for ApproxMath.Data;


  function testAddBasic() public {
    ApproxMath.Data memory a = ApproxMath.encode(1000);
    ApproxMath.Data memory b = ApproxMath.encode(100);

    Assert.equal(1100, a.add(b).decode(), "1000 + 110 should be 1100");
  }

  function testSubBasic() public {
    ApproxMath.Data memory a = ApproxMath.encode(1000);
    ApproxMath.Data memory b = ApproxMath.encode(100);

    Assert.equal(900, a.sub(b).decode(), "1000 - 100 should be 900");
  }

  function testMulBasic() public {
    ApproxMath.Data memory a = ApproxMath.encode(123456);
    ApproxMath.Data memory b = ApproxMath.encode(888888);

    Assert.equal(123456 * 888888, a.mul(b).decode(),
                 "123456 * 888888 should be 109738556928");
  }

  function testDivBasic() public {
    ApproxMath.Data memory a = ApproxMath.encode(888888);
    ApproxMath.Data memory b = ApproxMath.encode(123456);

    Assert.equal(7, a.div(b).decode(), "888888 / 123456 should be 7");
  }

  function testAddRoundDown() public {
    ApproxMath.Data memory a = ApproxMath.encode(2e25 ether);
    ApproxMath.Data memory b = ApproxMath.encode(5e25 szabo);
    ApproxMath.Data memory c = ApproxMath.encode(5000 wei);

    Assert.equal(2e25 ether + 5e25 szabo, a.add(b).add(c).decode(),
                 "Small number should be rounded out");
  }

  function testMulDivOverflow() public {
    ApproxMath.Data memory e6 = ApproxMath.encode(1e6);
    ApproxMath.Data memory e2 = ApproxMath.encode(1e2);

    ApproxMath.Data memory result = ApproxMath.encode(1);

    for (uint8 mulIdx = 0; mulIdx < 16; ++mulIdx) {
      result = result.mul(e6);
    }
    for (uint8 divIdx = 0; divIdx < 16; ++divIdx) {
      result = result.div(e2);
    }

    Assert.equal(
      9999999999999999999999999999999999999523536815264123072454590464,
      result.decode(), "(1e6 ^ 8) / (1e2 ^ 8) should be approximately 1e64");
  }
}
