import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, Button, Image } from 'ui/common'
import TxHashLink from 'components/TxHashLink'
import NewRequestLoading from 'images/new-request-load.svg'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'

const Container = styled.div`
  width: 100%;
  margin: 0 auto 30px auto;
`

const Number = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
})`
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background-image: linear-gradient(
    135deg,
    rgba(101, 103, 255, 0.25),
    rgba(93, 150, 255, 0.25)
  );
`

const ResultBox = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  bg: '#f6f6f6',
  fontSize: '13px',
  color: '#4a4a4a',
  px: '5px',
})`
  border-radius: 7px;
  height: 24px;
  font-weight: 600;
  font-family: Source Code Pro;
`

const ProcessList = ({ num, error, message, status, txHash }) => (
  <Flex alignItems="flex-start" mb="15px" style={{ maxWidth: '600px' }}>
    <Number>
      <Text fontSize="15px" fontWeight="bold" color="#506eff">
        {num}
      </Text>
    </Number>
    <Text fontSize="14px" color="#4a4a4a" flex={1} ml="17px" lineHeight="28px">
      {message}
    </Text>
    <Flex justifyContent="center" flex="0 0 50px">
      {!status ? (
        error ? (
          <Text fontSize="14px" color="red" fontWeight="900" lineHeight="28px">
            Error
          </Text>
        ) : (
          <Text
            fontSize="14px"
            color="#42c47f"
            fontWeight="900"
            lineHeight="28px"
          >
            {txHash ? (
              <span>
                Txn{' '}
                <TxHashLink href={`https://kovan.etherscan.io/tx/${txHash}`} />
              </span>
            ) : (
              'Done'
            )}
          </Text>
        )
      ) : (
        <CircleLoadingSpinner radius="20px" />
      )}
    </Flex>
  </Flex>
)

export default class Step2 extends React.Component {
  render() {
    const { onNext, isLoading, result, txHash, isError } = this.props
    const disabled = isLoading[0] || isLoading[1] || isLoading[2]

    console.log('ERR', isError)
    return (
      <Container>
        <Flex justifyContent="center" alignItems="center">
          <Image src={NewRequestLoading} mt={3} mb={2} />
        </Flex>
        <ProcessList
          num={1}
          message={'Serialize the parameters and compose query key'}
          status={isLoading[0]}
          error={isError[0]}
        />
        <ProcessList
          num={2}
          message={
            <Box style={{ display: 'inline-block' }}>
              Relay the request to providers
              {result && <ResultBox>Result: {result}</ResultBox>}
            </Box>
          }
          status={isLoading[1]}
          error={isError[1]}
        />
        <ProcessList
          num={3}
          message={'Commit result and proof to Ethereum blockchain'}
          status={isLoading[2]}
          error={isError[2]}
          txHash={txHash}
        />

        <Flex mt={4} justifyContent="center">
          <Button
            variant={disabled ? 'disGradient' : 'gradient'}
            onClick={onNext}
            disabled={disabled}
          >
            DONE
          </Button>
        </Flex>
      </Container>
    )
  }
}
