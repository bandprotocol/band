import React from 'react'
import BN from 'bn.js'
import ParameterListRender from './ParameterListRender'

export default ({ isEdit, handleParameterChange }) => (
  <ParameterListRender
    params={[
      {
        name: 'reward_percentage',
        value: new BN('30000000000000'),
        description:
          'The percentage of the reward pool in a challenge which is awarded to the winning party. Must be between 50% (the stake amount) to 100% (the total reward pool).',
        type: 'PERCENTAGE',
      },
      {
        name: 'min_deposit',
        value: new BN('100000000000000000000'),
        description:
          'The number of tokens an operator must deposit for their application and for the duration of their position.',
        type: 'TOKEN',
      },
      {
        name: 'reveal_time',
        value: new BN('240'),
        description:
          'The number of tokens an operator must deposit for their application and for the duration of their position.',
        type: 'TIME',
      },
    ]}
    isEdit={isEdit}
    handleParameterChange={handleParameterChange}
  />
)
