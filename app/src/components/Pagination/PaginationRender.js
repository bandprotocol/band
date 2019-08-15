import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text } from 'ui/common'
import colors from 'ui/colors'

const LeftRight = styled(Text).attrs({
  mx: '2px',
  fontSize: '25px',
  color: colors.blue.light,
})`
  cursor: pointer;
  border-radius: 3px;
  width: 30px;
  height: 25px;
  text-align: center;
  background-color: #ffffff;
  transition: background-color 300ms linear;

  &: hover {
    background-color: #dcdee8;
    transition: background-color 300ms linear;
  }

  pointer-events: ${p => (p.disabled ? 'none' : 'auto')};
  opacity: ${p => (p.disabled ? '0.4' : '1')};
`

const TextClickable = styled(Text).attrs({
  fontSize: '13px',
  mx: '6px',
})`
  cursor: pointer;
  border-radius: 3px;
  height: 25px;
  min-width: 30px;
  text-align: center;
  line-height: 27px;
  background-color: #ffffff;
  transition: background-color 300ms linear;

  &: hover {
    background-color: #dcdee8;
    transition: background-color 300ms linear;
  }

  color: ${p => (p.disabled ? '#ffffff' : colors.blue.light)};
  background: ${p => (p.disabled ? colors.blue.light : '#ffffff')};
  pointer-events: ${p => (p.disabled ? 'none' : 'auto')};
`

const DoubleLeftArrow = ({ color, transform }) => (
  <svg viewBox="-10 0 49 24" style={{ transform }}>
    <path
      style={{ fill: color }}
      d="M14 24c-.2 0-.5-.1-.6-.2l-13-11c-.3-.2-.4-.5-.4-.8 0-.3.1-.6.4-.8l13-11c.4-.4 1.1-.3 1.4.1.4.4.3 1.1-.1 1.4L2.5 12l12.1 10.2c.4.4.5 1 .1 1.4-.1.3-.4.4-.7.4z"
    />
    <path
      style={{ fill: color }}
      d="M26 24c-.2 0-.5-.1-.6-.2l-13-11c-.3-.2-.4-.5-.4-.8 0-.3.1-.6.4-.8l13-11c.4-.4 1.1-.3 1.4.1.4.4.3 1.1-.1 1.4L14.5 12l12.1 10.2c.4.4.5 1 .1 1.4-.1.3-.4.4-.7.4z"
    />
  </svg>
)

const LeftArrow = ({ color, transform }) => (
  <svg viewBox="-14 0 49 24" style={{ transform }}>
    <path
      style={{ fill: color }}
      d="M14 24c-.2 0-.5-.1-.6-.2l-13-11c-.3-.2-.4-.5-.4-.8 0-.3.1-.6.4-.8l13-11c.4-.4 1.1-.3 1.4.1.4.4.3 1.1-.1 1.4L2.5 12l12.1 10.2c.4.4.5 1 .1 1.4-.1.3-.4.4-.7.4z"
    />
  </svg>
)

const DoubleRightArrow = ({ color }) => (
  <DoubleLeftArrow color={color} transform={'rotate(180deg)'} />
)

const RightArrow = ({ color }) => (
  <LeftArrow color={color} transform={'rotate(180deg)'} />
)

const NumberPage = ({ currentPage, numberOfPages, onChangePage }) => {
  // case1 currentPage <= 3
  if (currentPage <= 3) {
    return (
      <React.Fragment>
        {[...Array(numberOfPages).keys()]
          .filter(page => page <= 4)
          .map(i => (
            <TextClickable
              key={i}
              onClick={() => onChangePage(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </TextClickable>
          ))}
      </React.Fragment>
    )
  }

  // case2 currentPage >= numberOfPages - 2
  if (currentPage >= numberOfPages - 2) {
    return (
      <React.Fragment>
        {[...Array(numberOfPages).keys()]
          .filter(page => page >= numberOfPages - 5)
          .map(i => (
            <TextClickable
              onClick={() => onChangePage(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </TextClickable>
          ))}
      </React.Fragment>
    )
  }

  // case3 currentPage > 3 && currentPage < numberOfPages - 2
  return (
    <React.Fragment>
      {[...Array(numberOfPages).keys()]
        .filter(page => page <= currentPage + 1 && page >= currentPage - 3)
        .map(i => (
          <TextClickable
            onClick={() => onChangePage(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </TextClickable>
        ))}
    </React.Fragment>
  )
}

export default ({ currentPage, numberOfPages, onChangePage }) =>
  numberOfPages <= 1 ? null : (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      style={{ height: '60px', borderRadius: '10px' }}
    >
      <LeftRight
        disabled={currentPage === 1}
        onClick={() => onChangePage(1)}
        left
      >
        <DoubleLeftArrow color={colors.blue.light} />
      </LeftRight>
      <LeftRight
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
        left
      >
        <LeftArrow color={colors.blue.light} />
      </LeftRight>
      {/* inside */}
      <NumberPage
        currentPage={currentPage}
        numberOfPages={numberOfPages}
        onChangePage={onChangePage}
      />
      <LeftRight
        disabled={currentPage === numberOfPages}
        onClick={() => onChangePage(currentPage + 1)}
        right
      >
        <RightArrow color={colors.blue.light} />
      </LeftRight>
      <LeftRight
        disabled={currentPage === numberOfPages}
        onClick={() => onChangePage(numberOfPages)}
        right
      >
        <DoubleRightArrow color={colors.blue.light} />
      </LeftRight>
      <Text
        fontSize="12px"
        lineHeight="25px"
        color="#a7a9b2"
        letterSpacing="-0.16px"
        px="3px"
      >
        {numberOfPages} PAGE{numberOfPages === 1 ? '' : 'S'}
      </Text>
    </Flex>
  )
