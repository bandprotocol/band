import React from 'react'
import styled from 'styled-components'
import { Box, Text, Flex } from 'ui/common'
import { colors } from 'ui'

const HoverBox = styled(Flex).attrs({
  mx: '5px',
})`
  border-radius: 50%;
  width: ${props => props.radius || '20px'};
  height: ${props => props.radius || '20px'};
  justify-content: center;
  align-items: center;
`

const PopupBox = styled(Box)`
  z-index: 1000000000;
  position: absolute;
  ${p => (p.left ? `left: ${p.left}px` : `right: ${p.right}px`)};
  right: ${p => p.right};
  top: ${p => 20 + p.top || 20}px;
  border: solid 1px #cbcfe3;
  box-shadow: 0 14px 18px 0 rgba(0, 0, 0, 0.07);
  width: ${p => p.width || 250}px;
  font-size: 13px;
  background: #fff;
  border-radius: 4px;
  color: #7c84a6;
  transition: all 250ms;

  ${p =>
    p.show
      ? `
    opacity: 1;
    transform: translateY(10px);
  `
      : `
    opacity: 0;
    transform: translateY(0);
    pointer-events: none;
  `}

  &:before {
    position: absolute;
    top: -8px;
    left: ${p => p.tipLeft + 5 || 5}px;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #cbcfe3;
  }

  &:after {
    position: absolute;
    top: -6.5px;
    left: ${p => p.tipLeft + 5 || 5}px;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #ffffff;
  }
`

export default class Tooltip extends React.Component {
  state = {
    show: false,
  }
  render() {
    const { top, left, right, tip, width, info, radius, bg } = this.props
    return (
      <Flex
        alignItems="center"
        style={{
          cursor: 'pointer',
          position: 'relative',
          height: '100%',
        }}
      >
        <HoverBox
          bg={bg || colors.purple.normal}
          radius={radius}
          onMouseLeave={() =>
            this.setState({
              show: false,
            })
          }
          onMouseEnter={() =>
            this.setState({
              show: true,
            })
          }
        >
          <Text size={14} color="#fff" weight="regular" textAlign="center">
            ?
          </Text>
        </HoverBox>
        <PopupBox
          show={this.state.show}
          width={width}
          top={top}
          left={left}
          right={right}
          tipLeft={tip ? tip.left : 0}
        >
          <Text color="#7c84a6" fontSize="12px" lineHeight="19px" py={2} px={3}>
            {info}
          </Text>
        </PopupBox>
      </Flex>
    )
  }
}
