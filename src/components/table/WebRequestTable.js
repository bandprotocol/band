import React from 'react'
import styled from 'styled-components'
import { Flex, Image, Text } from 'ui/common'
import colors from 'ui/colors'
import { createTable } from 'components/Table'
import ReactTooltip from 'react-tooltip'
import { copy } from 'utils/clipboard'
import { hexToParameters } from 'utils/helper'

export default createTable({
  columns: [
    {
      cell: { fontFamily: 'code' },
      data: (d, i) => (
        <Parameters variables={d.variables} types={d.meta.variables} />
      ),
      label: 'Parameter',
      flex: '0 0 650px',
      ml: '25px',
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
      data: d => d.value,
      label: 'Result',
      flex: '0 0 160px',
      style: { textAlign: 'center', marginRight: -20 },
    },
    {
      cell: { fontFamily: 'code' },
      data: d => <QueryKey keyOnChain={d.keyOnChain} />,
      label: 'Query Key',
      flex: '0 0 140px',
      style: { textAlign: 'center', marginRight: -20 },
    },
  ],
})

const Colors = [
  { bg: 'rgba(116, 238, 165, 0.4)', color: '#19783f' },
  { bg: 'rgba(119, 169, 244, 0.4)', color: '#2a63b9' },
  { bg: 'rgba(245, 160, 110, 0.4)', color: '#ba4500' },
]

const ParameterBox = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  mr: '6px',
  fontSize: '13px',
  fontWeight: 'bold',
  px: '7px',
})`
  height: 18px;
  border-radius: 4px;
  background-color: ${p => p.bg};
  font-color: ${p => p.color};
`

const Parameters = ({ variables, types }) => {
  return (
    <Flex mt="6px">
      {hexToParameters(variables, types).map((each, i) => (
        <ParameterBox {...Colors[i]}>{each}</ParameterBox>
      ))}
    </Flex>
  )
}

class QueryKey extends React.Component {
  state = {
    copied: false,
  }

  handleShowCopied(e) {
    copy(this.props.keyOnChain)
    this.setState(
      {
        copied: true,
      },
      () => {
        setTimeout(
          () =>
            this.setState({
              copied: false,
            }),
          500,
        )
      },
    )
    e.stopPropagation()
  }

  render() {
    return (
      <Text
        color="#5269ff"
        fontWeight={500}
        fontSize="13px"
        onClick={this.handleShowCopied.bind(this)}
      >
        {this.state.copied ? 'Copied' : 'Click to copy'}
      </Text>
    )
  }
}
