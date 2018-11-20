const BigNumber = web3.BigNumber;
const ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

function sha3 (left, right) {
  if (left === ZERO && right === ZERO) {
    return ZERO;
  }
  return web3.sha3(left + right.slice(2), { encoding: 'hex' });
}

function isIthBitZero (value, bit) {
  for (let idx = 0; idx < bit; ++idx) {
    value = value.dividedToIntegerBy(2);
  }
  return value.mod(2).equals(0);
}

function bigNumberToHex (value) {
  return '0x' + web3.padLeft(web3.toHex(value).slice(2), 64);
}

class Merkle {
  constructor () {
    this.root = ZERO;
    this.hashes = {};
    this.hashes[ZERO] = [ZERO, ZERO];
  }

  insert (key, val) {
    this.root = this._insert(
      new BigNumber(key),
      bigNumberToHex(new BigNumber(val)),
      this.root,
      0,
    );
  }

  _insert (key, val, currentRoot, currentLevel) {
    if (currentLevel === 160) {
      return val;
    }

    let [left, right] = this.hashes[currentRoot];
    if (isIthBitZero(key, 159 - currentLevel)) {
      left = this._insert(key, val, left, currentLevel + 1);
    } else {
      right = this._insert(key, val, right, currentLevel + 1);
    }

    const newRoot = sha3(left, right);
    this.hashes[newRoot] = [left, right];
    return newRoot;
  }

  getProof (key) {
    const proof = [];
    const keyNumber = new BigNumber(key);

    let mask = new BigNumber(0);
    let currentRoot = this.root;

    for (let level = 159; level >= 0; --level) {
      const [left, right] = this.hashes[currentRoot];
      if (isIthBitZero(keyNumber, level)) {
        if (right === ZERO) {
          mask = mask.add(new BigNumber(2).pow(level));
        } else {
          proof.push(right);
        }
        currentRoot = left;
      } else {
        if (left === ZERO) {
          mask = mask.add(new BigNumber(2).pow(level));
        } else {
          proof.push(left);
        }
        currentRoot = right;
      }
    }

    proof.push(bigNumberToHex(mask));
    proof.reverse();
    return [new BigNumber(currentRoot), proof];
  }
}

module.exports = {
  Merkle,
  bigNumberToHex,
};
