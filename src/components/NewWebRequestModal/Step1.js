import React from 'react'
import styled from 'styled-components'
import { Flex, Text, AbsoluteLink, Button, Image } from 'ui/common'
import RightArrowSrc from 'images/icon-right-arrow.svg'

const Container = styled.div`
  width: 100%;
  margin: 0 auto 30px auto;
`

const TextArea = styled.textarea`
  padding: 4px;
  margin-top: 12px;
  line-height: 1.6em;
  border-radius: 4px;
  border: solid 1px #e5e6f5;
  display: block;
  font-family: 'Source Code Pro';
  min-height: 300px;
  width: 100%;
  max-width: 100%;
`

export default ({ onNext, setJson }) => (
  <Container>
    <Flex>
      <Text fontSize="14px" mr="auto">
        Endpoint JSON
      </Text>
      <AbsoluteLink href="https://google.com" style={{ fontSize: '14px' }}>
        See specification
      </AbsoluteLink>
    </Flex>
    <TextArea onChange={e => setJson(e.target.value)}>
      {`{
  "request": {
    "url": "https://min-api.cryptocompare.com/data/price",
    "method": "GET",
    "params": {
      "fsym": "{0}",
      "tsyms": "{1}"
    }
  }
}`}
    </TextArea>
    <Flex mt={4} justifyContent="center">
      <Button variant="gradient" onClick={onNext}>
        NEXT
        <Image ml={3} height="0.8em" src={RightArrowSrc} />
      </Button>
    </Flex>
  </Container>
)
