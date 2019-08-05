# Band Protocol Overview

<figure>
  <img src='/assets/placeholder.png'>
  <figcaption>[Choose one one of three Pokemon style]</figcaption>
</figure>

In a layman's term, Band Protocol is a decentralized network the connects data providers with data consumers through token economics. What that means

## Let's Make it More Understandable with Infographics

Sure,

<!--
Band Protocol’s main functionality is to bridge the gap between decentralized applications and real-world data while also ensure that data is accurate and trustworthy through economic incentives. Band Protocol will initially be built on the Ethereum network, but the protocol itself is not restricted to Ethereum infrastructure. As the protocol gets more widespread adoption, it will support all leading smart contract platforms and power the new generation of decentralized applications. -->

## Intuitive Data Layer for Decentralized Applications

One of the most important design goals of Band Protocol is developer experience. Existing data provider networks, such as [ChainLink](https://chain.link) or [Provable](http://provable.xyz), require [asynchronous](<https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)>) interactions between smart contracts and data layers. Not only does this method complicates smart contract implementations, it also introduces a significant delay as two blockchain transactions need to be executed and confirmed sequentially.

<figure>
  <img src='/assets/placeholder.png'>
  <figcaption>[Asynchronous interaction is so bad]</figcaption>
</figure>

**Band Protocol shifts the paradigm and instead provides an intuitive query interface for decentralized applications to receive real-world data as a simple function call to a static smart contract**. Data providers are responsible for inputting and curating data to the blockchain, making it ready to be consumed by decentralized applications synchronously.

<figure>
  <img src='/assets/placeholder.png'>
  <figcaption>[Band Protocol design is the best]</figcaption>
</figure>

To learn more about developer experience with Band Protocol, head over to [DApp Developer Guide](/devs/overview.md).

## Consortium of Data Governance Groups

**Datasets inside Band Protocol are split into multiple Dataset Governance Groups**, each of which utilizes its own unique "dataset" token to stake, curate and govern
its dataset through mechanics like Token-Curated Registry or Token-Curated DataSources. While the data governance groups are independent and do not share the same token, they are all secured by Band Native Token through the bonding curve mechanic. This is fundamentally different from other data curation protocols such as DIRT Protocol [3], which exclusively uses one token for all types of curations. Having one token per group has two advantages.

TODO

## Protocol Economics

TODO
