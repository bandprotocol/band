# Lottery Results (Kovan)

This dataset provides up-to-date lottery results from worldwide lottery authorities. Decentralized applications can consume this data to help with their decision. Example applications include, decentralized betting, shared lottery pools, insurance, etc.

| Contract              | Address                                    |
| --------------------- | ------------------------------------------ |
| Dataset Token         | 0x79febf6b9f76853edbcbc913e6aae8232cfb9de9 |
| Dataset Oracle        | 0x79febf6b9f76853edbcbc913e6aae8232cfb9de9 |
| Governance Parameters | 0x79febf6b9f76853edbcbc913e6aae8232cfb9de9 |

## Key-Value Format

Similar to other datasets on Band Protocol, data consumers query for lottery data by providing an _input key_ in return for an _output value_. We cover the specification in this subsection.

### Input Key

An input key consists of three parts. All three parts are concatnated without a delimiter. Examples are provided as follows.

- The first part is one byte version number. The current version is `0x01`.
- The second part, [Lottery Type](#supported-lottery-types), is a 4-byte unique identifier that identifies lottery type.
- The remaining part will depend on lottery type.

### Output Value

An output needs to be parsed differently depending on the input key. Consult each lottery type below for more details.

## Supported Lottery Types

Below is the list of lottery types currently supported. Each type comes with its unique _keyword_ and 4-byte unique identifier defined as the first 4 bytes of [keccak256](https://emn178.github.io/online-tools/keccak_256.html) of the keyword.

### US Multi-State Lottery Association

| Keyword         | Hex ID     |
| --------------- | ---------- |
| `us_multistate` | `4ef12f43` |

Query-specific input part has two components, which are joined with `/` ascii character.

- The first component is 3-letter lottery identifier. Two values are currently supported: `PWB` for [Powerball](https://powerball.com) and `MMN` for [Mega Millions](https://www.megamillions.com/).
- The second component is the date of the lottery (US time) in the format of `YYYYMMDD`.

The 32-byte output can be parsed as follows:

- Each of the first five bytes represents a number of a non-special white ball. Each byte must be parsed to a `uint8`. For instance, hex `0x12` represents number 18.
- The next byte represents the value of the special ball (Powerball/Megaball).
- The next byte represents the multipler value.

Examples of input keys and their corresponding outputs are provided below.

| Input Key (hex)                      | Input Key (ascii)   | Output Value (hex)   |
| ------------------------------------ | ------------------- | -------------------- |
| `014ef12f435057422f3230313930383137` | `.....PWB/20190817` | `1215181e3c1403....` |
| `014ef12f434d4d4e2f3230313930383136` | `.....MMN/20190816` | `040e181a2e0e02....` |
