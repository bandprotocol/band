import random
from SparseMerkleTree import Merkle

m = Merkle()
for _ in range(10000 - 1):
    m.insert(random.randint(0, 2 ** 160 - 1), random.randint(0, 2 *256 - 1))

A = [0, 0]
A[0] = random.randint(0, 2 ** 160 - 1)
A[1] = random.randint(0, 2 ** 256 - 1)

m.insert(A[0], A[1])

mask, proof = m.get_proof(A[0])
print(len(m.hashes))
print('bytes32 rootHash = hex"{}";'.format(m.root.to_bytes(32, 'big').hex()))
print('address key = 0x{};'.format((A[0]).to_bytes(20, 'big').hex()))
print('bytes32 value = hex"{}";'.format((A[1]).to_bytes(32, 'big').hex()))
print('uint mask = {};'.format(mask))
print('bytes32[] memory proof = new bytes32[]({});'.format(len(proof)))
for i in range(len(proof)):
    print('proof[{}] = hex"{}";'.format(i, proof[i].to_bytes(32, 'big').hex()))
