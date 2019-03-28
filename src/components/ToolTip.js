import React from 'react'
import styled from 'styled-components'
import { Box, Text, Flex } from 'rebass'

const HoverBox = styled(Flex).attrs({
  mx: '5px',
})`
  font-family: Avenir-Medium;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`

const PopupBox = styled(Box)`
  z-index: 1000000000;
  position: absolute;
  ${p => (p.left ? `left: ${p.left}px` : `right: ${p.right}px`)};
  bottom: ${p => p.bottom || 20}px;
  border: ${p => `1px solid ${p.bg || '#cbcfe3'}`};
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
    top: ${p => (p.top ? -8 : 0)} px;
    bottom: ${p => (p.bottom ? -8 : 0)}px;
    left: ${p => p.tipLeft + 5 || 5}px;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: ${p => p.bottom && `8px solid ${p.bg || '#cbcfe3'}`};
    border-bottom: ${p => p.top && `8px solid ${p.bg || '#cbcfe3'}`};
  }
  &:after {
    position: absolute;
    top: ${p => (p.top ? -6.5 : 0)} px;
    bottom: ${p => (p.bottom ? -6.5 : 0)}px;
    left: ${p => p.tipLeft + 5 || 5}px;
    content: '';
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: ${p => p.bottom && `8px solid ${p.bg || '#ffffff'}`};
    border-bottom: ${p => p.top && `8px solid ${p.bg || '#ffffff'}`};
  }
`

export default class Tooltip extends React.Component {
  state = {
    show: false,
  }
  render() {
    const {
      top,
      bottom,
      left,
      right,
      tip = { lift: 0 },
      width,
      bg,
      textBg,
      textColor,
      children,
    } = this.props
    return (
      <Flex
        alignItems="center"
        style={{
          cursor: 'pointer',
          position: 'relative',
          height: '100%',
          display: 'inline-block',
        }}
      >
        <HoverBox
          bg={bg}
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
          bottom={bottom}
          left={left}
          right={right}
          tipLeft={tip.left}
          bg={textBg}
        >
          <Text
            fontSize="12px"
            lineHeight="19px"
            py={2}
            px={2}
            bg={textBg}
            color={textColor}
            textAlign="left"
          >
            {children}
          </Text>
        </PopupBox>
      </Flex>
    )
  }
}
