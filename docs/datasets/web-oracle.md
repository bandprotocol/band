# Web API Oracle (Kovan)

With Web API Oracle dataset, decentralized applications can request ask Band Protocol's data providers to supply query results from any arbitrary web 2.0 endpoints.

| Contract              | Address                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dataset Token         | [0x3DEb207E098F882C3F351C494b26B26548a33f5B](https://kovan.etherscan.io/address/0x3DEb207E098F882C3F351C494b26B26548a33f5B) |
| Dataset Oracle        | [0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8](https://kovan.etherscan.io/address/0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8) |
| Governance Parameters | [0x4D356d9e3bBB7191836fF431840B818f190117ac](https://kovan.etherscan.io/address/0x4D356d9e3bBB7191836fF431840B818f190117ac) |

## Key-Value Format

Similar to other datasets on Band Protocol, data consumers query for financial data by providing an _input key_ in return for an _output value_. Due to the flexible nature of this dataset, data consumers likely need to [request data update](../devs/data-query.html#request-data-update) prior to making a query. We cover the specification in this subsection.

### Input Key

An input key consists of two parts concatnated without a delimeter.

- The first part is an IPFS hash (in binary format) containing the [JSON request object](#json-request-specification).
- The second part is a variable length list of encoded parameters to the request object.

### Output Value

An output value is a 32-byte word. The method to parse the output is specified in the input key.

## JSON Request Specification

A JSON request object consists of three outer-level keys, `meta`, `request`, and `response`. A request object may contain placeholders for parameters in the format of `{0}`, `{1}`, ... to be resolved with parameters. See examples at the end of this tutorial.

### `meta`

This object specifies high-level informatation of the query. It is an object that contains four keys

- `version`: The current specification version. Must be 1.
- `info`: The info to show on Band data explorer. Must contain two keys: `image` for image URL, and `description` for description of this query object.
- `aggregation`: The method that data providers should combine result together. Can be `MEDIAN` or `MAJORITY`.
- `variables`: The array of variable types this query has. See [Parameter Encoding](#parameter-encoding) section for supported types.

### `request`

This object specifies the way data providers should fetch data from the external endpoint. It can contain at most four keys. Some keys are optionals.

- `url`: The URL endpoint to query. Must return a JSON object.
- `method`: HTTP verb to query, such as `GET`, `POST`, etc.
- `params`: JSON object to specify query parameters to send with the request. _Optional_.
- `data`: JSON body to send with the request (for non `GET` request). _Optional_.

### `response`

This object specifies the way data providers should parse the result into a 32-byte output. As of current, the object can have the following keys.

- `paths`: An array representing JSON path to get the result. The array value can be string to access object, or integer to access array index.
- `type`: The output type. Only `uint256` is support as of the current design.
- `multiplier`: The value to multiply before encoding the output, in case where the number contains decimal points. _Optional_.

## Parameter Encoding

A query key may contain parameters after IPFS hash of JSON request object. The parameters are concatnated without a delimeter, and their types are specified in the JSON object's `meta.variables` key. The following are supported type and the way to encode them.

- `string`: A string is encoded as a sequence of bytes (such as by using `abi.encodePacked`) ended with null terminator (hex `0x00`). A string may not contain `0x00` as its character.

- `uint8`, `uint16`, ..., `uint256`: An unsigned integer is encoded as its hex representation left-padded with zeroes to fill its size. That is, `uint8` uses 1 bytes, `uint16` uses 2 bytes, ... `uint256` uses full 32 bytes.

## Examples

### Get Current _safeLow_ Gas Cost from ETH Gas Station

**Query key (hex)**: `1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931d422245396e5596dd736166654c6f7700`

This query key can be split into two parts. The first part is the IPFS hash: `1220...96dd`, which corresponds to base58 hash [QmZMN8JgX95KmCAXV6fomkKnPs8A52Ad2CCsq4BrRay5Q8](https://ipfs.bandprotocol.com/api/v0/cat/QmZMN8JgX95KmCAXV6fomkKnPs8A52Ad2CCsq4BrRay5Q8).

```json
{
  "meta": {
    "version": "1",
    "info": {
      "image": "https://ethgasstation.info/images/ETHgas.png",
      "description": "ETH Gas Station API"
    },
    "aggregation": "MEDIAN",
    "variables": ["string"]
  },
  "request": {
    "url": "https://ethgasstation.info/json/ethgasAPI.json",
    "method": "GET"
  },
  "response": {
    "path": ["{0}"],
    "type": "uint256",
    "multiplier": 100000000
  }
}
```

Notice that the JSON request object has one variable of type `string`, which is the second part of the query key: `736166654c6f7700` and can be decoded to ascii string `safeLow`. This string will replace `{0}` under `response.path` at resolve time.

At this query key, data providers will supply the request of asking [ETH Gas Station](https://ethgasstation.info) the current gas price statistics on Ethreum blockchain. The result will be accessed using `safeLow` multiplied by `100000000`. Since ETH Gas Station returns the result in Gwei divided by 10, Band's data providers will provide the result in the unit of Wei.

### Get Number of Vitalik's Twitter Followers

**Query key (hex)**:
`1220a9ab69e5da8ac5e378796cef1d9cda4f38d9f42e77ef5aebfceeaf33334de0ed566974616c696b4275746572696e00`

Similar to the previous example, this query key contains two parts. The first part is an IPFS hash [ QmZkyD7Fkagvtd3dfxX7qdxK9RQXi3eZLq379ybRuYKDcG](https://ipfs.bandprotocol.com/api/v0/cat/QmZkyD7Fkagvtd3dfxX7qdxK9RQXi3eZLq379ybRuYKDcG), and the second part is the encoded string of `VitalikButerin`. Combining the two parts, Band's data providers will use Twitter API to get the number of follows that Vitalik currently has. Note that there is no multipler when building query response.

```json
{
  "meta": {
    "version": "1",
    "info": {
      "image": "https://abs.twimg.com/favicons/favicon.ico",
      "description": "Twitter Follower Count"
    },
    "aggregation": "MEDIAN",
    "variables": ["string"]
  },
  "request": {
    "url": "https://cdn.syndication.twimg.com/widgets/followbutton/info.json",
    "method": "GET",
    "params": {
      "screen_names": "{0}"
    }
  },
  "response": {
    "path": [0, "followers_count"],
    "type": "uint256"
  }
}
```
