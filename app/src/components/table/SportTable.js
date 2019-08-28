import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'ui/common'
import Link from 'components/Link'
import { createTable } from 'components/Table'
import ReactTooltip from 'react-tooltip'

const LogoTeam = styled(Flex).attrs({
  mr: '10px',
})`
  background-image: url(${p => p.src});
  width: ${p => p.size};
  height: ${p => p.size};
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`

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
    {
      data: d => (
        <Flex flexDirection="row" alignItems="center">
          <LogoTeam src={d.image} size="20px" />
          {d.name}
        </Flex>
      ),
      label: 'Source',
      flex: '1',
      mr: 2,
    },
    {
      cell: { fontFamily: 'code', color: '#5269ff', fontSize: 13 },
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
          {/* {d.warning && (
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
          )} */}
        </React.Fragment>
      ),
      label: 'Last Update',
      flex: '0 0 130px',
      mr: 2,
      style: { textAlign: 'center' },
    },
    {
      cell: { fontFamily: 'code' },
      data: d => `(${d.home}) ${d.scoreHome} - ${d.scoreAway} (${d.away})`,
      label: 'Result',
      flex: '0 0 210px',
      style: { textAlign: 'center', marginRight: -20 },
    },
  ],
})
