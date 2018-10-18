import hashlib
from eth_utils import keccak

def sha3(left, right):
    if left == 0 and right == 0:
        return 0
    
    s = b''
    for each in (left, right):
        s += each.to_bytes(32, 'big')
    hash_hex = keccak(primitive=s).hex()
    return int(hash_hex, 16)


class Merkle(object):
    
    def __init__(self):
        self.root = 0
        self.hashes = {
            0: (0, 0)
        }

    def insert(self, key, val):
        self.root = self._insert(key, val, self.root, 0)
        
    def _insert(self, key, val, current_root, current_level):
        if current_level == 160:
            return val
        
        left, right = self.hashes[current_root]
        if key & (1 << (159 - current_level)) == 0:
            left = self._insert(key, val, left, current_level + 1)
        else:
            right = self._insert(key, val, right, current_level + 1)
            
        if current_root != 0:
            del self.hashes[current_root]
        
        new_root = sha3(left, right)
        self.hashes[new_root] = (left, right)
        return new_root
    
    def get_proof(self, key):
        mask = 0
        proof = []
        
        current_root = self.root
        for level in range(159, -1, -1):
            left, right = self.hashes[current_root]
            
            if key & (1 << level) == 0:
                if right == 0:
                    mask |= (1 << level)
                else:
                    proof.append(right)
                current_root = left
            else:
                if left == 0:
                    mask |= (1 << level)
                else:
                    proof.append(left)
                current_root = right
                
        return [mask] +list(reversed(proof))
    
    def verify_proof(self, key, val, proof):
        current_leaf = val
        proof_index = 1
        
        mask = proof[0]
        
        for level in range(160):
            if mask & (1 << level) > 0:
                another_leaf = 0
            else:
                another_leaf = proof[proof_index]
                proof_index += 1
            
            if key & (1 << level) == 0:
                left_leaf = current_leaf
                right_leaf = another_leaf
            else:
                left_leaf = another_leaf
                right_leaf = current_leaf
                
            current_leaf = sha3(left_leaf, right_leaf)
            
        return current_leaf == self.root
    

if __name__ == '__main__':
    # m = Merkle()
    # m.insert(0, 100)
    # m.insert(1, 200)
    # m.insert(2, 500)
    
    # print(m.root.to_bytes(32, 'big').hex())
    
    # mask, proof = m.get_proof(2)

    # print(m.verify_proof(2, 500, mask, proof))

    # print(proof)
    # print('bytes32 rootHash = hex"{}"'.format(m.root.to_bytes(32, 'big').hex()))
    # print('bytes32 key = hex"{}"'.format((2).to_bytes(32, 'big').hex()))
    # print('bytes32 value = hex"{}"'.format((500).to_bytes(32, 'big').hex()))
    # print('uint mask = {}'.format(mask))
    # print('hex"{}"'.format(proof[0].to_bytes(32, 'big').hex()))

    # Insert 200000 items
    # for _ in range(200000):
    # #   m.insert()
    pass
    