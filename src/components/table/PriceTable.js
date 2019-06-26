import React from 'react'
import { Text, Card } from 'ui/common'
import colors from 'ui/colors'
import { createTable } from 'components/Table'
import Link from 'components/Link'

export default createTable({
  columns: [
    {
      cell: { fontFamily: 'code' },
      data: (d, i) => (
        <Link
          target="_blank"
          href={`http://rinkeby.etherscan.io/address/${d.address}`}
        >
          <Card
            bg={colors.chart[i]}
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
    { data: d => d.name, label: 'Source', flex: '1', mr: 2 },
    {
      cell: { fontFamily: 'code', color: '#868FCD', fontSize: 13 },
      data: d => d.lastUpdate.fromNow().replace('a few', ''),
      label: 'Last Update',
      flex: '0 0 200px',
      mr: 2,
      style: { textAlign: 'center' },
    },
    {
      cell: { fontFamily: 'code' },
      data: (d, i, { type }) =>
        d.lastValue.toLocaleString('en-US', {
          currency: 'USD',
          minimumFractionDigits: type === 'FX' ? 4 : 2,
          maximumFractionDigits: type === 'FX' ? 4 : 2,
        }),
      label: 'Price',
      flex: '0 0 200px',
      style: { textAlign: 'right' },
    },
  ],
})
