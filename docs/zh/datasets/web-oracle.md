# Web API 预言机 (Kovan)

使用Web API Oracle 数据集，Dapp可以请求 Band Protocol的数据提供者提供的来自任意Web 2.0的查询结果。

| Contract              | Address                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dataset Token         | [0x3DEb207E098F882C3F351C494b26B26548a33f5B](https://kovan.etherscan.io/address/0x3DEb207E098F882C3F351C494b26B26548a33f5B) |
| Dataset Oracle        | [0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8](https://kovan.etherscan.io/address/0x7f525974d824a6C4Efd54b9E7CB268eBEFc94aD8) |
| Governance Parameters | [0x4D356d9e3bBB7191836fF431840B818f190117ac](https://kovan.etherscan.io/address/0x4D356d9e3bBB7191836fF431840B818f190117ac) |

## Key-Value 格式

与Band Protocol 上的其他数据集类似，数据消费者通过提供 _输入键_ 来查询财务数据，以返回一个 _输出值_。由于此数据集的灵活性，数据使用者可能需要在进行查询之前[请求数据更新](../devs/data-query.html#request-data-update)。我们在本小节中讨论了这种规格。

### 输入键

输入键由两部分组成，这两部分在没有通过分隔符连接在一起。

- 第一部分是包含[JSON请求对象](#json-request-specification)的IPFS Hash(二进制格式)。
- 第二部分是请求对象编码参数的可变长度列表。

### Output Value

输出值是一个32字节的词。解析输出的方法在输入键中指定。

## JSON 请求 规范

JSON请求对象由三个外层键组成，`meta`、`request`和 `response`。请求对象可以包含参数的占位符，格式为`{0}`,`{1}`... 。参见本教程末尾的示例。

### `meta`

此对象指定查询的高级信息。它是一个包含四个键的对象。

- `version`: 当前规范版本。必须是1。
- `info`: 在 Band 数据浏览器上显示的信息。必须包含两个键：用于图像URL的`image`和用于描述此查询对象的`description`。
- `aggregation`：数据提供者应该将结果组合在一起的方法。可以是`中位数`或`多数`。
- `variables`：查询具有的变量类型数组。 支持的类型请看 [Parameter Encoding](#parameter-encoding)。

### `request`

此对象指定数据提供者从外部获取数据的方式。它最多可以包含四个键。有些键是可选的。

- `url`：要查询的URL。必须返回JSON对象。
- `method`: 用于查询的HTTP动词，如`GET`、`POST`等。
- `params`: JSON对象指定要与请求一起发送的查询参数。 _可选_。
- `data`: 与请求一起发送的JSON主体 (对于非`GET` 请求)。 _可选_。

### `response`

此对象指定数据提供程序应将结果解析为32字节输出。到目前为止，对象可以具有以下键。

- `paths`：表示获取结果的JSON路径的数组。数组值可以是字符串访问对象，也可以是整数访问数组索引。
- `type`：输出类型。目前的设计只支持 `uint256`。
- `multiplier`：在编码输出之前要相乘的值，以防数字包含小数点。 _可选_.

## 参数编码

查询键可以包含JSON请求对象的IPFS hash之后的参数。这些参数不通过分隔符连接，它们的类型在JSON对象的`meta.variables` 键中指定。下面是支持的类型和编码方法。

- `string`： 字符串被编码为以null终止符(hex `0x00`)结束的字节序列(例如使用 `abi.encodePacked`)。 字符串可能不包含0x00作为其字符。
- `uint8`，`uint16`， ... ，`uint256`： 无符号整数被编码为十六进制表示形式，左填充零以填充其大小。
`uint8` 使用 1个 字节，`uint16` 使用 2个 字节，... `uint256` 使用 32个 字节.

## 示例

### 从ETH Gas Station获取当前的 _safeLow_ 花费


**Query key (hex)**: `1220a39f6304fff1d0e09d093fbb52b733a1dc866d451cb5931d422245396e5596dd736166654c6f7700`

这个查询可以分为两部分。第一部分是 IPFS hash: `1220...96dd`，对应的base58 hash [QmZMN8JgX95KmCAXV6fomkKnPs8A52Ad2CCsq4BrRay5Q8](https://ipfs.bandprotocol.com/api/v0/cat/QmZMN8JgX95KmCAXV6fomkKnPs8A52Ad2CCsq4BrRay5Q8).

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
注意JSON请求对象有一个类型为`string` 的变量，查询键第二部分：`736166654c6f7700` 和可以解码为ascii字符串的`safeLow`。这个字符串将在解析时替换`esponse.path`下的{0}`。

在此查询下，数据提供者将提供查询[ETH Gas Station](https://ethgasstation.info)当前Ethreum区块链上的Gas价格的请求。将使用`safeLow`乘以`100000000`作为访问结果。由于 ETH Gas Station 以Gwei除以10的形式返回结果，所以Band的数据提供者将以`Wei`为单位提供结果。

### 获取 Vitalik在Twitter上的粉丝数量

**Query key (hex)**:
`1220a9ab69e5da8ac5e378796cef1d9cda4f38d9f42e77ef5aebfceeaf33334de0ed566974616c696b4275746572696e00`

类似上面的例子，查询包含 2 部分。第1部分是 IPFS hash [ QmZkyD7Fkagvtd3dfxX7qdxK9RQXi3eZLq379ybRuYKDcG](https://ipfs.bandprotocol.com/api/v0/cat/QmZkyD7Fkagvtd3dfxX7qdxK9RQXi3eZLq379ybRuYKDcG)，第 2 部分是编码的字符串 `VitalikButerin`拼接 2 个这 2 部分， Band的数据提供者将使用Twitter API获取Vitalik目前拥有的关注数。注意，在构建查询响应时没有乘数。

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
