# System Architecture

Before diving into more technical details, we pause here to discuss high-level architecture of Band's provider network. If you are more intestered in setting up a node, feel free to skip to [the next section](getting-started.md).

## Verification of Data Signature On-Chain

Whenever a datapoint is submitted to on-chain dataset smart contract, the data must be signed by more than 2/3 of active data providers. Thus unless, there's a clear consensus on the result, data won't be updated on-chain. Data provider network is a network of data providers that ensure data gets confirmed and signed by all providers within a short period of time.

## Flow of Data to Provider Network

When a user request data query. Here's what going on under the hood.

1. User sends a data request to the _Coordinator Node_. This node is currently run by Band Foundation and is responsible for communicating with data providers.

2. The coordinator dispatches the data request to all active _Provider Nodes_ in the network.

3. The provider nodes perform data query, sign the data, and pass it back to the coordinator.

4. The coordinator aggregates all results from all providers, and pass all results to active provide nodes to obtain the signatures on aggregated data.

5. The provider nodes perform mathematical aggregation of all results, sign the data, and pass it back to the coordinator.

6. The coordinator verifies the integrity of final signatures and sends the aggregated result

As a data provider, you are responsible to maintain your provider node and ensure its uptime. If a provider node does not repond to the coordinator within a respected timeframe, its data will not be included to the final result and may risk losing token stakes from token holders.

## Constant Feeding of Data

As seen above, data updates on Band dataset is driven by requests to the coordinator node. However, some datapoints, such as Ethereum price, need to be updated regularly for the benefits of data consumers. In that case, Band Foundation is responsible for invoking data requests to the coordinator node to make sure that constate updates occur.

## Next Iteration

While in this current design, Band Protocol cannot control the validity of data as the signatures of data providers are required on-chain, the system relies on Band Protocol's uptime to ensure its liveness. In other words, if the coordinator goes down, the whole system also halts. We are aware of this issue and are actively working on decentralized, leaderless communication protocol to remove this point of failure. Expect to see an update soon!
