import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Text } from 'ui/common'
import colors from 'ui/colors'

const TextClickable = styled(Text).attrs({
  px: '7px',
  py: '12px',
  fontSize: '13px',
  color: colors.purple.normal,
})`
  cursor: pointer;

  pointer-events: ${p => (p.disabled ? 'none' : 'auto')};
  opacity: ${p => (p.disabled ? '0.4' : '1')};
`

const LessThan = ({ currentPage, numberOfPages, onChangePage }) =>
  [...Array(numberOfPages).keys()].map(i => (
    <TextClickable
      onClick={() => onChangePage(i + 1)}
      disabled={currentPage === i + 1}
    >
      {i + 1}
    </TextClickable>
  ))

const MoreThan = ({ currentPage, numberOfPages, onChangePage }) => {
  // case1 currentPage = 1
  if (currentPage === 1) {
    return (
      <React.Fragment>
        {[...Array(numberOfPages).keys()]
          .filter(page => page <= 3)
          .map(i => (
            <TextClickable
              onClick={() => onChangePage(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </TextClickable>
          ))}
        <Text px="5px" py="9px" fontSize={3}>
          ...
        </Text>
        <TextClickable
          disabled={currentPage === numberOfPages}
          onClick={() => onChangePage(numberOfPages)}
        >
          {numberOfPages}
        </TextClickable>
      </React.Fragment>
    )
  }

  // show lastIndex - 5 to lastIndex
  if (currentPage >= numberOfPages - 3 && currentPage <= numberOfPages) {
    const startIndex = numberOfPages - 6
    return (
      <React.Fragment>
        {[...Array(numberOfPages).keys()]
          .filter(page => page >= startIndex)
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

  return (
    <React.Fragment>
      {[...Array(numberOfPages).keys()]
        .filter(page => page <= currentPage + 2 && page >= currentPage - 1)
        .map(i => (
          <TextClickable
            onClick={() => onChangePage(i)}
            disabled={currentPage === i}
          >
            {i}
          </TextClickable>
        ))}
      <Text px="5px" py="9px" fontSize={3}>
        ...
      </Text>
      <TextClickable
        disabled={currentPage === numberOfPages}
        onClick={() => onChangePage(numberOfPages)}
      >
        {numberOfPages}
      </TextClickable>
    </React.Fragment>
  )
}

export default ({ currentPage, numberOfPages, onChangePage }) => (
  <Flex flexDirectio="row" alignItem="center" justifyContent="center">
    <TextClickable
      disabled={currentPage === 1}
      onClick={() => onChangePage(1)}
      left
    >
      <i class="fas fa-angle-left" />
    </TextClickable>
    <TextClickable
      disabled={currentPage === 1}
      onClick={() => onChangePage(currentPage - 1)}
      left
    >
      Previous
    </TextClickable>
    {/* inside */}
    {/* Less than 6 */}
    {numberOfPages <= 6 && (
      <LessThan
        currentPage={currentPage}
        numberOfPages={numberOfPages}
        onChangePage={onChangePage}
      />
    )}
    {/* More than 6 */}
    {numberOfPages > 6 && (
      <MoreThan
        currentPage={currentPage}
        numberOfPages={numberOfPages}
        onChangePage={onChangePage}
      />
    )}
    <TextClickable
      disabled={currentPage === numberOfPages}
      onClick={() => onChangePage(currentPage + 1)}
      right
    >
      Next
    </TextClickable>
    <TextClickable
      disabled={currentPage === numberOfPages}
      onClick={() => onChangePage(numberOfPages)}
      right
    >
      <i class="fas fa-angle-right" />
    </TextClickable>
  </Flex>
)
