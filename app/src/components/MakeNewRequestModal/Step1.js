import React from 'react'
import styled from 'styled-components'
import { Flex, Text, AbsoluteLink, Button, Image, Card, Box } from 'ui/common'
import RightArrowSrc from 'images/icon-right-arrow.svg'

const Container = styled.div`
  width: 100%;
  margin: 35px auto 30px auto;
`

const Method = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  width: '60px',
  fontSize: '14px',
  color: '#4a4a4a',
})`
  height: 26px;
  border-radius: 14px;
  background-color: #eeeeee;
  font-weight: bold;
  font-family: bio-sans;
`

const IpfsPathBox = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
  bg: '#fff',
  color: '#4a4a4a',
  fontSize: '14px',
  fontWeight: '600',
  p: '10px 7px',
  mt: '11px',
  mb: '15px',
})`
  border-radius: 4px;
  box-shadow: 0 4px 20px 0 #f4f4f4;
  border: solid 1px #e5e6f5;
  background-color: #ffffff;
`

const Row = styled(Flex)`
  line-height: 36px;

  &:not(:last-child) {
    border-bottom: solid 1px #e5e6f5;
  }
`

const Label = styled(Box)`
  background: #f8f8f8;
  width: 100px;
  text-align: center;
  font-family: Source Code Pro;
  font-size: 13px;
  font-weight: 600;
  border-right: solid 1px #e5e6f5;
`

const Input = styled.input`
  line-height: 36px;
  padding: 0 0.85em;
  font-size; 14px;
  display: block;
  flex: 1;
  border: none;
`

export default class Step1 extends React.Component {
  render() {
    const { onNext, ipfsPath, request, params, onSetParams } = this.props

    return (
      <Container>
        <Flex>
          <Text fontSize="14px" mr="auto">
            Endpoint JSON
          </Text>
          <AbsoluteLink href="./integration" style={{ fontSize: '14px' }}>
            See specification
          </AbsoluteLink>
        </Flex>
        <IpfsPathBox>{ipfsPath}</IpfsPathBox>
        <Flex alignItems="center" pt="10px" pb="16px" style={{ minWidth: 0 }}>
          <Method>{request.method}</Method>
          <Text
            color="#4a4a4a"
            fontSize="14px"
            fontWeight="600"
            ml="21px"
            flex={1}
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            {request.url}
          </Text>
        </Flex>
        <Card
          border="solid 1px #E5E6F5"
          borderRadius="4px"
          style={{ overflow: 'hidden' }}
        >
          {params.map((val, i) => (
            <Row>
              <Label>Param {`{${i}}`}</Label>
              <Input
                value={val}
                onChange={e => {
                  const newParams = params
                  newParams[i] = e.target.value
                  onSetParams(newParams)
                }}
              />
            </Row>
          ))}
        </Card>
        <Flex mt={4} justifyContent="center">
          <Button variant="gradient" onClick={onNext} width="128px">
            QUERY
            <Image ml={3} height="0.8em" src={RightArrowSrc} />
          </Button>
        </Flex>
      </Container>
    )
  }
}
