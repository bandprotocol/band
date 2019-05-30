import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'ui/common'

const THead = styled(Flex).attrs(p => ({
  px: 4,
  alignItems: 'center',
}))`
  background: #fafaff;
  height: 36px;
  border-top: solid 1px #e5e6f5;
`

const TBody = styled(Box).attrs(p => ({
  px: 4,
  py: 2,
}))`
  border-top: solid 1px #e5e6f5;
  font-size: 14px;
`

export const createTable = ({ columns }) =>
  class Table extends React.Component {
    render() {
      const { data, ...props } = this.props

      // console.log('DATA', data)

      return (
        <Box {...props}>
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
          <TBody>
            {data.map((r, i) => (
              <Flex style={{ lineHeight: '32px' }}>
                {columns.map(({ label, data, cell = {}, ...p }) => (
                  <Text {...p} {...cell}>
                    {data(r, i, props)}
                  </Text>
                ))}
              </Flex>
            ))}
          </TBody>
        </Box>
      )
    }
  }
