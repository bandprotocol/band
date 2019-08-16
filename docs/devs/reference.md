# Oracle Interface Reference

This section explains formally

## `queryPrice`

```ts
function queryPrice() external view returns (uint256);
```

## `query`

```ts
enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

function query(bytes calldata input)
  external payable
  returns (bytes32 output, uint256 updatedAt, QueryStatus status);
```
