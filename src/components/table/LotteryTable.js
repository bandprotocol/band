import React from 'react'
import { Text, Card } from 'ui/common'
import Link from 'components/Link'
import colors from 'ui/colors'
import { createTable } from 'components/Table'
import ReactTooltip from 'react-tooltip'

const pad = n => `0${n}`.slice(-2)

export default createTable({
  columns: [
    {
      cell: { fontFamily: 'code' },
      data: (d, i) => (
        <Link
          target="_blank"
          href={`http://kovan.etherscan.io/address/${d.address}`}
        >
          <Text fontFamily="code">{d.address.slice(0, 18)}</Text>
        </Link>
      ),
      label: 'Address',
      flex: '0 0 180px',
      mr: 2,
    },
    { data: d => d.name, label: 'Source', flex: '1', mr: 2 },
    {
      cell: { fontFamily: 'code', color: '#868FCD', fontSize: 13 },
      data: d => (
        <React.Fragment>
          {d.lastUpdate.fromNow().replace('a few', '')}
          {d.warning && (
            <ReactTooltip
              id={`warning-${d.address}`}
              type="error"
              effect="solid"
            >
              {d.warning}
            </ReactTooltip>
          )}
          {d.warning && (
            <ion-icon
              name="ios-warning"
              data-tip
              data-for={`warning-${d.address}`}
              style={{
                marginLeft: 8,
                fontSize: 20,
                color: colors.red.normal,
                verticalAlign: 'text-bottom',
              }}
            />
          )}
        </React.Fragment>
      ),
      label: 'Last Update',
      flex: '0 0 130px',
      mr: 2,
      style: { textAlign: 'center' },
    },
    {
      cell: { fontFamily: 'code' },
      data: d => (
        <Text fontSize={14} fontFamily="code">
          {`${pad(d.whiteBall1)} ${pad(d.whiteBall2)} ${pad(
            d.whiteBall3,
          )} ${pad(d.whiteBall4)} ${pad(d.whiteBall5)} ${pad(d.redBall)} | `}
          <span style={{ fontWeight: 900 }}>{d.mul}x</span>
        </Text>
      ),
      label: 'Winning Numbers',
      flex: '0 0 200px',
      style: { textAlign: 'right' },
    },
  ],
})
