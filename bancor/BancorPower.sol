pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title BancorPower, modified from the original "BancorFomula.sol"
 *        written by Bancor https://github.com/bancorprotocol/contracts
 *
 * @dev Changes include:
 *  1. Remove Bancor's specific functions and replace SafeMath with OpenZeppelin's.
 *  2. Change code from Contract to Library and change maxExpArray from being array
 *     with binary search inside `findPositionInMaxExpArray` to a simple linear search.
 *  3. Add requirement check that baseN >= baseD (this is always true for Bancor).
 * Licensed under Apache Lisense, Version 2.0.
 */
library BancorPower {
    using SafeMath for uint256;

    string internal constant version = '0.3';
    uint256 private constant ONE = 1;
    uint32 private constant MAX_WEIGHT = 1000000;
    uint8 private constant MIN_PRECISION = 32;
    uint8 private constant MAX_PRECISION = 127;

    /**
        Auto-generated via 'PrintIntScalingFactors.py'
    */
    uint256 private constant FIXED_1 = 0x080000000000000000000000000000000;
    uint256 private constant FIXED_2 = 0x100000000000000000000000000000000;
    uint256 private constant MAX_NUM = 0x200000000000000000000000000000000;

    /**
        Auto-generated via 'PrintLn2ScalingFactors.py'
    */
    uint256 private constant LN2_NUMERATOR   = 0x3f80fe03f80fe03f80fe03f80fe03f8;
    uint256 private constant LN2_DENOMINATOR = 0x5b9de1d10bf4103d647b0955897ba80;

    /**
        Auto-generated via 'PrintFunctionOptimalLog.py' and 'PrintFunctionOptimalExp.py'
    */
    uint256 private constant OPT_LOG_MAX_VAL = 0x15bf0a8b1457695355fb8ac404e7a79e3;
    uint256 private constant OPT_EXP_MAX_VAL = 0x800000000000000000000000000000000;

    /**
        General Description:
            Determine a value of precision.
            Calculate an integer approximation of (_baseN / _baseD) ^ (_expN / _expD) * 2 ^ precision.
            Return the result along with the precision used.

        Detailed Description:
            Instead of calculating "base ^ exp", we calculate "e ^ (log(base) * exp)".
            The value of "log(base)" is represented with an integer slightly smaller than "log(base) * 2 ^ precision".
            The larger "precision" is, the more accurately this value represents the real value.
            However, the larger "precision" is, the more bits are required in order to store this value.
            And the exponentiation function, which takes "x" and calculates "e ^ x", is limited to a maximum exponent (maximum value of "x").
            This maximum exponent depends on the "precision" used, and it is given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
            Hence we need to determine the highest precision which can be used for the given input, before calling the exponentiation function.
            This allows us to compute "base ^ exp" with maximum accuracy and without exceeding 256 bits in any of the intermediate computations.
            This functions assumes that "_expN < 2 ^ 256 / log(MAX_NUM - 1)", otherwise the multiplication should be replaced with a "safeMul".
    */
    function power(uint256 _baseN, uint256 _baseD, uint32 _expN, uint32 _expD) internal pure returns (uint256, uint8) {
        require(_baseN < MAX_NUM);
        require(_baseN >= _baseD);

        uint256 baseLog;
        uint256 base = _baseN * FIXED_1 / _baseD;
        if (base < OPT_LOG_MAX_VAL) {
            baseLog = optimalLog(base);
        }
        else {
            baseLog = generalLog(base);
        }

        uint256 baseLogTimesExp = baseLog * _expN / _expD;
        if (baseLogTimesExp < OPT_EXP_MAX_VAL) {
            return (optimalExp(baseLogTimesExp), MAX_PRECISION);
        }
        else {
            uint8 precision = findPositionInMaxExpArray(baseLogTimesExp);
            return (generalExp(baseLogTimesExp >> (MAX_PRECISION - precision), precision), precision);
        }
    }

    /**
    *   c >= 10^18
    *
     */
    function log(uint256 _c, uint256 _baseN, uint256 _baseD) internal pure returns (uint256) {
        // require(_baseN < MAX_NUM)
        require(_baseN >= _baseD);

        uint256 baseLog;
        uint256 base = _baseN * FIXED_1 / _baseD;
        if (base < OPT_LOG_MAX_VAL) {
            baseLog = optimalLog(base);
        } else {
            baseLog = generalLog(base);
        }

        return (baseLog * _c) / FIXED_1;
    }

    /**
        Compute log(x / FIXED_1) * FIXED_1.
        This functions assumes that "x >= FIXED_1", because the output would be negative otherwise.
    */
    function generalLog(uint256 x) internal pure returns (uint256) {
        uint256 res = 0;

        // If x >= 2, then we compute the integer part of log2(x), which is larger than 0.
        if (x >= FIXED_2) {
            uint8 count = floorLog2(x / FIXED_1);
            x >>= count; // now x < 2
            res = count * FIXED_1;
        }

        // If x > 1, then we compute the fraction part of log2(x), which is larger than 0.
        if (x > FIXED_1) {
            for (uint8 i = MAX_PRECISION; i > 0; --i) {
                x = (x * x) / FIXED_1; // now 1 < x < 4
                if (x >= FIXED_2) {
                    x >>= 1; // now 1 < x < 2
                    res += ONE << (i - 1);
                }
            }
        }

        return res * LN2_NUMERATOR / LN2_DENOMINATOR;
    }

    /**
        Compute the largest integer smaller than or equal to the binary logarithm of the input.
    */
    function floorLog2(uint256 _n) internal pure returns (uint8) {
        uint8 res = 0;

        if (_n < 256) {
            // At most 8 iterations
            while (_n > 1) {
                _n >>= 1;
                res += 1;
            }
        }
        else {
            // Exactly 8 iterations
            for (uint8 s = 128; s > 0; s >>= 1) {
                if (_n >= (ONE << s)) {
                    _n >>= s;
                    res |= s;
                }
            }
        }

        return res;
    }

    /**
        The global "maxExpArray" is sorted in descending order, and therefore the following statements are equivalent:
        - This function finds the position of [the smallest value in "maxExpArray" larger than or equal to "x"]
        - This function finds the highest position of [a value in "maxExpArray" larger than or equal to "x"]
    */
    function findPositionInMaxExpArray(uint256 _x) internal pure returns (uint8) {
        if (0x1c35fedd14ffffffffffffffffffffffff >= _x) return  32;
        if (0x1b0ce43b323fffffffffffffffffffffff >= _x) return  33;
        if (0x19f0028ec1ffffffffffffffffffffffff >= _x) return  34;
        if (0x18ded91f0e7fffffffffffffffffffffff >= _x) return  35;
        if (0x17d8ec7f0417ffffffffffffffffffffff >= _x) return  36;
        if (0x16ddc6556cdbffffffffffffffffffffff >= _x) return  37;
        if (0x15ecf52776a1ffffffffffffffffffffff >= _x) return  38;
        if (0x15060c256cb2ffffffffffffffffffffff >= _x) return  39;
        if (0x1428a2f98d72ffffffffffffffffffffff >= _x) return  40;
        if (0x13545598e5c23fffffffffffffffffffff >= _x) return  41;
        if (0x1288c4161ce1dfffffffffffffffffffff >= _x) return  42;
        if (0x11c592761c666fffffffffffffffffffff >= _x) return  43;
        if (0x110a688680a757ffffffffffffffffffff >= _x) return  44;
        if (0x1056f1b5bedf77ffffffffffffffffffff >= _x) return  45;
        if (0x0faadceceeff8bffffffffffffffffffff >= _x) return  46;
        if (0x0f05dc6b27edadffffffffffffffffffff >= _x) return  47;
        if (0x0e67a5a25da4107fffffffffffffffffff >= _x) return  48;
        if (0x0dcff115b14eedffffffffffffffffffff >= _x) return  49;
        if (0x0d3e7a392431239fffffffffffffffffff >= _x) return  50;
        if (0x0cb2ff529eb71e4fffffffffffffffffff >= _x) return  51;
        if (0x0c2d415c3db974afffffffffffffffffff >= _x) return  52;
        if (0x0bad03e7d883f69bffffffffffffffffff >= _x) return  53;
        if (0x0b320d03b2c343d5ffffffffffffffffff >= _x) return  54;
        if (0x0abc25204e02828dffffffffffffffffff >= _x) return  55;
        if (0x0a4b16f74ee4bb207fffffffffffffffff >= _x) return  56;
        if (0x09deaf736ac1f569ffffffffffffffffff >= _x) return  57;
        if (0x0976bd9952c7aa957fffffffffffffffff >= _x) return  58;
        if (0x09131271922eaa606fffffffffffffffff >= _x) return  59;
        if (0x08b380f3558668c46fffffffffffffffff >= _x) return  60;
        if (0x0857ddf0117efa215bffffffffffffffff >= _x) return  61;
        if (0x07ffffffffffffffffffffffffffffffff >= _x) return  62;
        if (0x07abbf6f6abb9d087fffffffffffffffff >= _x) return  63;
        if (0x075af62cbac95f7dfa7fffffffffffffff >= _x) return  64;
        if (0x070d7fb7452e187ac13fffffffffffffff >= _x) return  65;
        if (0x06c3390ecc8af379295fffffffffffffff >= _x) return  66;
        if (0x067c00a3b07ffc01fd6fffffffffffffff >= _x) return  67;
        if (0x0637b647c39cbb9d3d27ffffffffffffff >= _x) return  68;
        if (0x05f63b1fc104dbd39587ffffffffffffff >= _x) return  69;
        if (0x05b771955b36e12f7235ffffffffffffff >= _x) return  70;
        if (0x057b3d49dda84556d6f6ffffffffffffff >= _x) return  71;
        if (0x054183095b2c8ececf30ffffffffffffff >= _x) return  72;
        if (0x050a28be635ca2b888f77fffffffffffff >= _x) return  73;
        if (0x04d5156639708c9db33c3fffffffffffff >= _x) return  74;
        if (0x04a23105873875bd52dfdfffffffffffff >= _x) return  75;
        if (0x0471649d87199aa990756fffffffffffff >= _x) return  76;
        if (0x04429a21a029d4c1457cfbffffffffffff >= _x) return  77;
        if (0x0415bc6d6fb7dd71af2cb3ffffffffffff >= _x) return  78;
        if (0x03eab73b3bbfe282243ce1ffffffffffff >= _x) return  79;
        if (0x03c1771ac9fb6b4c18e229ffffffffffff >= _x) return  80;
        if (0x0399e96897690418f785257fffffffffff >= _x) return  81;
        if (0x0373fc456c53bb779bf0ea9fffffffffff >= _x) return  82;
        if (0x034f9e8e490c48e67e6ab8bfffffffffff >= _x) return  83;
        if (0x032cbfd4a7adc790560b3337ffffffffff >= _x) return  84;
        if (0x030b50570f6e5d2acca94613ffffffffff >= _x) return  85;
        if (0x02eb40f9f620fda6b56c2861ffffffffff >= _x) return  86;
        if (0x02cc8340ecb0d0f520a6af58ffffffffff >= _x) return  87;
        if (0x02af09481380a0a35cf1ba02ffffffffff >= _x) return  88;
        if (0x0292c5bdd3b92ec810287b1b3fffffffff >= _x) return  89;
        if (0x0277abdcdab07d5a77ac6d6b9fffffffff >= _x) return  90;
        if (0x025daf6654b1eaa55fd64df5efffffffff >= _x) return  91;
        if (0x0244c49c648baa98192dce88b7ffffffff >= _x) return  92;
        if (0x022ce03cd5619a311b2471268bffffffff >= _x) return  93;
        if (0x0215f77c045fbe885654a44a0fffffffff >= _x) return  94;
        if (0x01ffffffffffffffffffffffffffffffff >= _x) return  95;
        if (0x01eaefdbdaaee7421fc4d3ede5ffffffff >= _x) return  96;
        if (0x01d6bd8b2eb257df7e8ca57b09bfffffff >= _x) return  97;
        if (0x01c35fedd14b861eb0443f7f133fffffff >= _x) return  98;
        if (0x01b0ce43b322bcde4a56e8ada5afffffff >= _x) return  99;
        if (0x019f0028ec1fff007f5a195a39dfffffff >= _x) return 100;
        if (0x018ded91f0e72ee74f49b15ba527ffffff >= _x) return 101;
        if (0x017d8ec7f04136f4e5615fd41a63ffffff >= _x) return 102;
        if (0x016ddc6556cdb84bdc8d12d22e6fffffff >= _x) return 103;
        if (0x015ecf52776a1155b5bd8395814f7fffff >= _x) return 104;
        if (0x015060c256cb23b3b3cc3754cf40ffffff >= _x) return 105;
        if (0x01428a2f98d728ae223ddab715be3fffff >= _x) return 106;
        if (0x013545598e5c23276ccf0ede68034fffff >= _x) return 107;
        if (0x01288c4161ce1d6f54b7f61081194fffff >= _x) return 108;
        if (0x011c592761c666aa641d5a01a40f17ffff >= _x) return 109;
        if (0x0110a688680a7530515f3e6e6cfdcdffff >= _x) return 110;
        if (0x01056f1b5bedf75c6bcb2ce8aed428ffff >= _x) return 111;
        if (0x00faadceceeff8a0890f3875f008277fff >= _x) return 112;
        if (0x00f05dc6b27edad306388a600f6ba0bfff >= _x) return 113;
        if (0x00e67a5a25da41063de1495d5b18cdbfff >= _x) return 114;
        if (0x00dcff115b14eedde6fc3aa5353f2e4fff >= _x) return 115;
        if (0x00d3e7a3924312399f9aae2e0f868f8fff >= _x) return 116;
        if (0x00cb2ff529eb71e41582cccd5a1ee26fff >= _x) return 117;
        if (0x00c2d415c3db974ab32a51840c0b67edff >= _x) return 118;
        if (0x00bad03e7d883f69ad5b0a186184e06bff >= _x) return 119;
        if (0x00b320d03b2c343d4829abd6075f0cc5ff >= _x) return 120;
        if (0x00abc25204e02828d73c6e80bcdb1a95bf >= _x) return 121;
        if (0x00a4b16f74ee4bb2040a1ec6c15fbbf2df >= _x) return 122;
        if (0x009deaf736ac1f569deb1b5ae3f36c130f >= _x) return 123;
        if (0x00976bd9952c7aa957f5937d790ef65037 >= _x) return 124;
        if (0x009131271922eaa6064b73a22d0bd4f2bf >= _x) return 125;
        if (0x008b380f3558668c46c91c49a2f8e967b9 >= _x) return 126;
        if (0x00857ddf0117efa215952912839f6473e6 >= _x) return 127;
        require(false);
        return 0;
    }

    /**
        This function can be auto-generated by the script 'PrintFunctionGeneralExp.py'.
        It approximates "e ^ x" via maclaurin summation: "(x^0)/0! + (x^1)/1! + ... + (x^n)/n!".
        It returns "e ^ (x / 2 ^ precision) * 2 ^ precision", that is, the result is upshifted for accuracy.
        The global "maxExpArray" maps each "precision" to "((maximumExponent + 1) << (MAX_PRECISION - precision)) - 1".
        The maximum permitted value for "x" is therefore given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
    */
    function generalExp(uint256 _x, uint8 _precision) internal pure returns (uint256) {
        uint256 xi = _x;
        uint256 res = 0;

        xi = (xi * _x) >> _precision; res += xi * 0x3442c4e6074a82f1797f72ac0000000; // add x^02 * (33! / 02!)
        xi = (xi * _x) >> _precision; res += xi * 0x116b96f757c380fb287fd0e40000000; // add x^03 * (33! / 03!)
        xi = (xi * _x) >> _precision; res += xi * 0x045ae5bdd5f0e03eca1ff4390000000; // add x^04 * (33! / 04!)
        xi = (xi * _x) >> _precision; res += xi * 0x00defabf91302cd95b9ffda50000000; // add x^05 * (33! / 05!)
        xi = (xi * _x) >> _precision; res += xi * 0x002529ca9832b22439efff9b8000000; // add x^06 * (33! / 06!)
        xi = (xi * _x) >> _precision; res += xi * 0x00054f1cf12bd04e516b6da88000000; // add x^07 * (33! / 07!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000a9e39e257a09ca2d6db51000000; // add x^08 * (33! / 08!)
        xi = (xi * _x) >> _precision; res += xi * 0x000012e066e7b839fa050c309000000; // add x^09 * (33! / 09!)
        xi = (xi * _x) >> _precision; res += xi * 0x000001e33d7d926c329a1ad1a800000; // add x^10 * (33! / 10!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000002bee513bdb4a6b19b5f800000; // add x^11 * (33! / 11!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000003a9316fa79b88eccf2a00000; // add x^12 * (33! / 12!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000048177ebe1fa812375200000; // add x^13 * (33! / 13!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000005263fe90242dcbacf00000; // add x^14 * (33! / 14!)
        xi = (xi * _x) >> _precision; res += xi * 0x000000000057e22099c030d94100000; // add x^15 * (33! / 15!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000000057e22099c030d9410000; // add x^16 * (33! / 16!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000000000052b6b54569976310000; // add x^17 * (33! / 17!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000000000004985f67696bf748000; // add x^18 * (33! / 18!)
        xi = (xi * _x) >> _precision; res += xi * 0x000000000000003dea12ea99e498000; // add x^19 * (33! / 19!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000000000000031880f2214b6e000; // add x^20 * (33! / 20!)
        xi = (xi * _x) >> _precision; res += xi * 0x000000000000000025bcff56eb36000; // add x^21 * (33! / 21!)
        xi = (xi * _x) >> _precision; res += xi * 0x000000000000000001b722e10ab1000; // add x^22 * (33! / 22!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000000000000001317c70077000; // add x^23 * (33! / 23!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000000000000000000cba84aafa00; // add x^24 * (33! / 24!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000000000000000000082573a0a00; // add x^25 * (33! / 25!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000000000000000000005035ad900; // add x^26 * (33! / 26!)
        xi = (xi * _x) >> _precision; res += xi * 0x000000000000000000000002f881b00; // add x^27 * (33! / 27!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000000000000000000001b29340; // add x^28 * (33! / 28!)
        xi = (xi * _x) >> _precision; res += xi * 0x00000000000000000000000000efc40; // add x^29 * (33! / 29!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000000000000000000000007fe0; // add x^30 * (33! / 30!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000000000000000000000000420; // add x^31 * (33! / 31!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000000000000000000000000021; // add x^32 * (33! / 32!)
        xi = (xi * _x) >> _precision; res += xi * 0x0000000000000000000000000000001; // add x^33 * (33! / 33!)

        return res / 0x688589cc0e9505e2f2fee5580000000 + _x + (ONE << _precision); // divide by 33! and then add x^1 / 1! + x^0 / 0!
    }

    /**
        Return log(x / FIXED_1) * FIXED_1
        Input range: FIXED_1 <= x <= LOG_EXP_MAX_VAL - 1
        Auto-generated via 'PrintFunctionOptimalLog.py'
        Detailed description:
        - Rewrite the input as a product of natural exponents and a single residual r, such that 1 < r < 2
        - The natural logarithm of each (pre-calculated) exponent is the degree of the exponent
        - The natural logarithm of r is calculated via Taylor series for log(1 + x), where x = r - 1
        - The natural logarithm of the input is calculated by summing up the intermediate results above
        - For example: log(250) = log(e^4 * e^1 * e^0.5 * 1.021692859) = 4 + 1 + 0.5 + log(1 + 0.021692859)
    */
    function optimalLog(uint256 x) internal pure returns (uint256) {
        uint256 res = 0;

        uint256 y;
        uint256 z;
        uint256 w;

        if (x >= 0xd3094c70f034de4b96ff7d5b6f99fcd8) {res += 0x40000000000000000000000000000000; x = x * FIXED_1 / 0xd3094c70f034de4b96ff7d5b6f99fcd8;} // add 1 / 2^1
        if (x >= 0xa45af1e1f40c333b3de1db4dd55f29a7) {res += 0x20000000000000000000000000000000; x = x * FIXED_1 / 0xa45af1e1f40c333b3de1db4dd55f29a7;} // add 1 / 2^2
        if (x >= 0x910b022db7ae67ce76b441c27035c6a1) {res += 0x10000000000000000000000000000000; x = x * FIXED_1 / 0x910b022db7ae67ce76b441c27035c6a1;} // add 1 / 2^3
        if (x >= 0x88415abbe9a76bead8d00cf112e4d4a8) {res += 0x08000000000000000000000000000000; x = x * FIXED_1 / 0x88415abbe9a76bead8d00cf112e4d4a8;} // add 1 / 2^4
        if (x >= 0x84102b00893f64c705e841d5d4064bd3) {res += 0x04000000000000000000000000000000; x = x * FIXED_1 / 0x84102b00893f64c705e841d5d4064bd3;} // add 1 / 2^5
        if (x >= 0x8204055aaef1c8bd5c3259f4822735a2) {res += 0x02000000000000000000000000000000; x = x * FIXED_1 / 0x8204055aaef1c8bd5c3259f4822735a2;} // add 1 / 2^6
        if (x >= 0x810100ab00222d861931c15e39b44e99) {res += 0x01000000000000000000000000000000; x = x * FIXED_1 / 0x810100ab00222d861931c15e39b44e99;} // add 1 / 2^7
        if (x >= 0x808040155aabbbe9451521693554f733) {res += 0x00800000000000000000000000000000; x = x * FIXED_1 / 0x808040155aabbbe9451521693554f733;} // add 1 / 2^8

        z = y = x - FIXED_1;
        w = y * y / FIXED_1;
        res += z * (0x100000000000000000000000000000000 - y) / 0x100000000000000000000000000000000; z = z * w / FIXED_1; // add y^01 / 01 - y^02 / 02
        res += z * (0x0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa - y) / 0x200000000000000000000000000000000; z = z * w / FIXED_1; // add y^03 / 03 - y^04 / 04
        res += z * (0x099999999999999999999999999999999 - y) / 0x300000000000000000000000000000000; z = z * w / FIXED_1; // add y^05 / 05 - y^06 / 06
        res += z * (0x092492492492492492492492492492492 - y) / 0x400000000000000000000000000000000; z = z * w / FIXED_1; // add y^07 / 07 - y^08 / 08
        res += z * (0x08e38e38e38e38e38e38e38e38e38e38e - y) / 0x500000000000000000000000000000000; z = z * w / FIXED_1; // add y^09 / 09 - y^10 / 10
        res += z * (0x08ba2e8ba2e8ba2e8ba2e8ba2e8ba2e8b - y) / 0x600000000000000000000000000000000; z = z * w / FIXED_1; // add y^11 / 11 - y^12 / 12
        res += z * (0x089d89d89d89d89d89d89d89d89d89d89 - y) / 0x700000000000000000000000000000000; z = z * w / FIXED_1; // add y^13 / 13 - y^14 / 14
        res += z * (0x088888888888888888888888888888888 - y) / 0x800000000000000000000000000000000;                      // add y^15 / 15 - y^16 / 16

        return res;
    }

    /**
        Return e ^ (x / FIXED_1) * FIXED_1
        Input range: 0 <= x <= OPT_EXP_MAX_VAL - 1
        Auto-generated via 'PrintFunctionOptimalExp.py'
        Detailed description:
        - Rewrite the input as a sum of binary exponents and a single residual r, as small as possible
        - The exponentiation of each binary exponent is given (pre-calculated)
        - The exponentiation of r is calculated via Taylor series for e^x, where x = r
        - The exponentiation of the input is calculated by multiplying the intermediate results above
        - For example: e^5.021692859 = e^(4 + 1 + 0.5 + 0.021692859) = e^4 * e^1 * e^0.5 * e^0.021692859
    */
    function optimalExp(uint256 x) internal pure returns (uint256) {
        uint256 res = 0;

        uint256 y;
        uint256 z;

        z = y = x % 0x10000000000000000000000000000000; // get the input modulo 2^(-3)
        z = z * y / FIXED_1; res += z * 0x10e1b3be415a0000; // add y^02 * (20! / 02!)
        z = z * y / FIXED_1; res += z * 0x05a0913f6b1e0000; // add y^03 * (20! / 03!)
        z = z * y / FIXED_1; res += z * 0x0168244fdac78000; // add y^04 * (20! / 04!)
        z = z * y / FIXED_1; res += z * 0x004807432bc18000; // add y^05 * (20! / 05!)
        z = z * y / FIXED_1; res += z * 0x000c0135dca04000; // add y^06 * (20! / 06!)
        z = z * y / FIXED_1; res += z * 0x0001b707b1cdc000; // add y^07 * (20! / 07!)
        z = z * y / FIXED_1; res += z * 0x000036e0f639b800; // add y^08 * (20! / 08!)
        z = z * y / FIXED_1; res += z * 0x00000618fee9f800; // add y^09 * (20! / 09!)
        z = z * y / FIXED_1; res += z * 0x0000009c197dcc00; // add y^10 * (20! / 10!)
        z = z * y / FIXED_1; res += z * 0x0000000e30dce400; // add y^11 * (20! / 11!)
        z = z * y / FIXED_1; res += z * 0x000000012ebd1300; // add y^12 * (20! / 12!)
        z = z * y / FIXED_1; res += z * 0x0000000017499f00; // add y^13 * (20! / 13!)
        z = z * y / FIXED_1; res += z * 0x0000000001a9d480; // add y^14 * (20! / 14!)
        z = z * y / FIXED_1; res += z * 0x00000000001c6380; // add y^15 * (20! / 15!)
        z = z * y / FIXED_1; res += z * 0x000000000001c638; // add y^16 * (20! / 16!)
        z = z * y / FIXED_1; res += z * 0x0000000000001ab8; // add y^17 * (20! / 17!)
        z = z * y / FIXED_1; res += z * 0x000000000000017c; // add y^18 * (20! / 18!)
        z = z * y / FIXED_1; res += z * 0x0000000000000014; // add y^19 * (20! / 19!)
        z = z * y / FIXED_1; res += z * 0x0000000000000001; // add y^20 * (20! / 20!)
        res = res / 0x21c3677c82b40000 + y + FIXED_1; // divide by 20! and then add y^1 / 1! + y^0 / 0!

        if ((x & 0x010000000000000000000000000000000) != 0) res = res * 0x1c3d6a24ed82218787d624d3e5eba95f9 / 0x18ebef9eac820ae8682b9793ac6d1e776; // multiply by e^2^(-3)
        if ((x & 0x020000000000000000000000000000000) != 0) res = res * 0x18ebef9eac820ae8682b9793ac6d1e778 / 0x1368b2fc6f9609fe7aceb46aa619baed4; // multiply by e^2^(-2)
        if ((x & 0x040000000000000000000000000000000) != 0) res = res * 0x1368b2fc6f9609fe7aceb46aa619baed5 / 0x0bc5ab1b16779be3575bd8f0520a9f21f; // multiply by e^2^(-1)
        if ((x & 0x080000000000000000000000000000000) != 0) res = res * 0x0bc5ab1b16779be3575bd8f0520a9f21e / 0x0454aaa8efe072e7f6ddbab84b40a55c9; // multiply by e^2^(+0)
        if ((x & 0x100000000000000000000000000000000) != 0) res = res * 0x0454aaa8efe072e7f6ddbab84b40a55c5 / 0x00960aadc109e7a3bf4578099615711ea; // multiply by e^2^(+1)
        if ((x & 0x200000000000000000000000000000000) != 0) res = res * 0x00960aadc109e7a3bf4578099615711d7 / 0x0002bf84208204f5977f9a8cf01fdce3d; // multiply by e^2^(+2)
        if ((x & 0x400000000000000000000000000000000) != 0) res = res * 0x0002bf84208204f5977f9a8cf01fdc307 / 0x0000003c6ab775dd0b95b4cbee7e65d11; // multiply by e^2^(+3)

        return res;
    }
}
