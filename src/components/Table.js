import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'ui/common'

const THead = styled(Flex).attrs(p => ({
  px: 4,
  alignItems: 'center',
}))`
  background: #eef3ff;
  height: 36px;
`

const TBody = styled(Box).attrs(p => ({
  px: 4,
  py: 2,
}))`
  font-size: 14px;
`

export const createTable = ({ columns }) =>
  class Table extends React.Component {
    shouldComponentUpdate(prevProps) {
      return this.props.data !== prevProps.data
    }

    render() {
      const { data, numDigits, ...props } = this.props
      const numDataProviders = data.length

      return (
        <Box {...props} style={{ backgroundColor: 'white', color: '#4a4a4a' }}>
          <THead>
            {columns.map(({ label, data, cell, ...p }) => (
              <Text
                fontFamily="code"
                fontSize={13}
                fontWeight={700}
                key={label}
                {...p}
              >
                {label}
              </Text>
            ))}
          </THead>
          <TBody mb="-10px">
            {data.map((r, i) => (
              <Flex style={{ lineHeight: '32px' }}>
                {columns.map(({ label, data, cell = {}, ...p }) => (
                  <Text {...p} {...cell}>
                    {data(r, i, props, numDataProviders, numDigits)}
                  </Text>
                ))}
              </Flex>
            ))}
          </TBody>
        </Box>
      )
    }
  }
