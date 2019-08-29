import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, Button } from 'ui/common'
import VerifySuccess from 'images/verify-success.svg'
import VerifyFailed from 'images/verify-failed.svg'
import RightArrowSrc from 'images/icon-right-arrow.svg'
import OutLinkSrc from 'images/out.svg'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const AbsoluteLink = styled.a.attrs(props => ({
  href: props.to || props.href,
  target: '_blank',
  rel: 'noopener',
}))`
  text-decoration: none;
  color: inherit;
`

const NextButton = styled(Button).attrs({
  width: '130px',
  height: '40px',
  mt: '8px',
})`
  line-height: 30px;
  cursor: pointer;
  background-image: linear-gradient(281deg, #968cff, #8998ff);

  & .next-arrow {
    transition: all 500ms;
  }

  &:hover {
    & .next-arrow {
      transform: translateX(40px);
    }
  }
`

export default ({ loading, txHash, hideModal }) => (
  <Flex flexDirection="column" mt="20px">
    {loading ? (
      <Flex width="100%" justifyContent="center" alignItems="center" mt="30px">
        <CircleLoadingSpinner radius="80px" />
      </Flex>
    ) : (
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Image src={txHash ? VerifySuccess : VerifyFailed} my={2} />
        {txHash ? (
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            <Text
              fontSize="14px"
              fontWeight="500"
              color="#4a4a4a"
              my={1}
              mr={2}
            >
              Your identity has been verified.
            </Text>
            <AbsoluteLink href={`https://kovan.etherscan.io/tx/${txHash}`}>
              <Image src={OutLinkSrc} />
            </AbsoluteLink>
          </Flex>
        ) : (
          <Text fontSize="14px" fontWeight="500" color="#4a4a4a" my={1}>
            Failed! Please try agian.
          </Text>
        )}
        <NextButton onClick={hideModal}>
          <Flex flexDirection="row" justifyContent="flex-start" width="100%">
            <Text mr={2}>Done</Text>
            <Image src={RightArrowSrc} className="next-arrow" />
          </Flex>
        </NextButton>
      </Flex>
    )}
  </Flex>
)
