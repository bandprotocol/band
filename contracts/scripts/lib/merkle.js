const BN = web3.utils.BN;
const ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

function sha3 (left, right) {
  if (left === ZERO && right === ZERO) {
    return ZERO;
  }
  return web3.utils.sha3(left + right.slice(2), { encoding: 'hex' });
}

function isIthBitZero (value, bit) {
  for (let idx = 0; idx < bit; ++idx) {
    value = value.divn(2);
  }
  return value.modn(2) === 0;
}

function bigNumberToHex (value) {
  return '0x' + web3.utils.padLeft(web3.utils.toHex(value).slice(2), 64);
}

class Merkle {
  constructor () {
    this.root = ZERO;
    this.hashes = {};
    this.hashes[ZERO] = [ZERO, ZERO];
  }

  insert (key, val) {
    this.root = this._insert(
      new BN(key, 16),
      bigNumberToHex(new BN(val)),
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
    const keyNumber = web3.utils.toBN(key);

    let mask = new BN(0);
    let currentRoot = this.root;

    for (let level = 159; level >= 0; --level) {
      const [left, right] = this.hashes[currentRoot];
      if (isIthBitZero(keyNumber, level)) {
        if (right === ZERO) {
          mask = mask.add(new BN(1).shln(level));
        } else {
          proof.push(right);
        }
        currentRoot = left;
      } else {
        if (left === ZERO) {
          mask = mask.add(new BN(1).shln(level));
        } else {
          proof.push(left);
        }
        currentRoot = right;
      }
    }

    proof.push(bigNumberToHex(mask));
    proof.reverse();
    return [web3.utils.toBN(currentRoot), proof];
  }
}

module.exports = {
  Merkle,
  bigNumberToHex,
};
