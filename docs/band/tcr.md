# Token-Curated Registry

::: warning DEPRECATED
Token-Curated Registry is a concept from Band Protocol's previous iteration. The current version focuses primarily on Token-Curated Datasources mechanic.
:::

[Token Curated Registry (TCR)](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7) is a method for a community to collectively curate a list of data directly. It is suitable for curating a more relatively subjective information in the form of list that requires community-wide opinion.

## Breaking Down TCR

- An applicant **applies** for an entry to be listed on the TCR by staking `min_deposit` community token. The entry becomes listed if it is not challenged for `apply_stage_length` duration.

- A community member can **challenge** an entry by staking a matching deposit. The entry then goes to a voting period. Using [Commit-Reveal Voting](https://medium.com/gitcoin/commit-reveal-scheme-on-ethereum-25d1d1a25428), token holders vote to approve or reject the challenge.

- If less than `min_participation_pct` of tokens participated, the challenge is considered inconclusive. The stake is returned back to the challenger, and the entry stays on the TCR.

- If enough tokens participate and more than `support_required_pct` vote in favor of the challenge, the entry is removed and the entry's deposit becomes challenger's reward. The challenger receives `dispensation_percentage` percent, while the winning voters get the remaining.

- On the other hand, if the challenge fails, the challenger's stake is confiscated and split among the entry owner and voters that reject the challenge. The entry owner receives `dispensation_percentage` percent, while the winning voters get the remaining.

## TCR Parameters

|         Parameter         |                           Description                           |
| :-----------------------: | :-------------------------------------------------------------: |
|   `apply_stage_length`    |      The time pending before an entry is listed in the TCR      |
|       `min_deposit`       |   Minimum amount of token required for an entry to be listed    |
| `dispensation_percentage` |     Percentage of reward going to entry owner or challenger     |
|       `commit_time`       |            Duration in seconds of the commit period             |
|       `reveal_time`       |            Duration in seconds of the reveal period             |
|  `min_participation_pct`  | Min percentage of participants required to vote for a challenge |
|  `support_required_pct`   |     Threshold to determine if a challenge succeeds or fails     |
