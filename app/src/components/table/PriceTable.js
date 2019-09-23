import React from 'react'
import { Text, Card, Flex, Image } from 'ui/common'
import { createTable } from 'components/Table'
import Link from 'components/Link'
import { getLink } from 'utils/etherscan'

export default createTable({
  columns: [
    {
      cell: { fontFamily: 'code' },
      data: (d, i, props, numDataProviders) => (
        <Link target="_blank" href={`${getLink()}/address/${d.address}`}>
          <Card
            bg={`hsl(${(i * 360) / numDataProviders}, 80%, 70%)`}
            borderRadius={4}
            mr={2}
            style={{ height: 12, width: 12, display: 'inline-block' }}
          />
          <Text fontFamily="code" style={{ display: 'inline-block' }}>
            {d.address.slice(0, 18)}
          </Text>
        </Link>
      ),
      label: 'Address',
      flex: '0 0 200px',
      mr: 2,
    },
    {
      data: d => (
        <Flex flexDirection="row" alignItems="center">
          <Image
            src={d.image}
            width="18px"
            mr={2}
            style={{ filter: 'grayscale(1)' }}
          />
          {d.name}
        </Flex>
      ),
      label: 'Source',
      flex: '1',
      mr: 2,
    },
    {
      cell: { fontFamily: 'code', fontSize: 13 },
      data: d => d.lastUpdate.fromNow().replace('a few', ''),
      label: 'Last Update',
      flex: '0 0 200px',
      mr: 2,
      style: { textAlign: 'center' },
    },
    {
      cell: { fontFamily: 'code', color: '#6976d2' },
      data: (d, i, props, numDataProviders, numDigits) =>
        d.lastValue.toLocaleString('en-US', {
          currency: 'USD',
          minimumFractionDigits: numDigits,
          maximumFractionDigits: numDigits,
        }),
      label: 'Price',
      flex: '0 0 200px',
      style: { textAlign: 'right' },
    },
  ],
})
