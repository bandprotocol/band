# Connect with Band Protocol

In this section, we

## Find Data Sources of your Interest

As explained in [Architecture Section](/TODO), Band Protocol consists of multiple independent data governance groups, each of which is intended to serve different types of data. As an example, the data source to

## Define Query Interface

```typescript
interface QueryInterface {
  enum QueryStatus { INVALID, OK, NOT_AVAILABLE, DISAGREEMENT }

  /// TODO
  function query(bytes calldata input)
    external payable returns (bytes output, uint256 updatedAt, QueryStatus status);

  /// TODO
  function queryPrice()
    external view returns (uint256);
}
```

## Perform a Query On-Chain

---

## (Optional) Request Updated Data with BandApp
