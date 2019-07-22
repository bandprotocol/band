import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Card, Text, Button, Image } from 'ui/common'
import RightArrowSrc from 'images/icon-right-arrow.svg'
import DualArrowSrc from 'images/dual-arrows.svg'
import { createLoadingButton } from 'components/BaseButton'
import axios from 'axios'

const Container = styled.div`
  width: 100%;
  margin: 0 auto 30px auto;
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

const CallButton = createLoadingButton(styled(Button).attrs({
  variant: 'gradient',
})`
  background-image: linear-gradient(90deg, #4a4a4a, #656565);
  line-height: 24px;
  font-size: 12px;
`)
export default class Step2 extends React.Component {
  state = {
    params: ['', '', ''],
    result: null,
    error: null,
  }

  async testcall() {
    const { params } = this.state
    const queryJson = JSON.parse(
      this.props.json
        .replace('{0}', params[0])
        .replace('{1}', params[1])
        .replace('{2}', params[2]),
    )
    try {
      const { data } = await axios.post(
        'https://band-kovan.herokuapp.com/data/web_request_test',
        queryJson,
      )
      this.setState({
        result: data.value,
      })
    } catch (e) {
      console.error(e.message)
    }
  }

  render() {
    const { onNext } = this.props
    const { params, result } = this.state

    return (
      <Container>
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
                  const params = this.state.params
                  params[i] = e.target.value
                  this.setState({ params })
                }}
              />
            </Row>
          ))}
        </Card>

        <Flex mt={3} alignItems="center">
          <Text fontSize="14px" mr="auto">
            Try a few calls before committing
          </Text>
          <Box ml="auto">
            {!result ? (
              <CallButton onClick={this.testcall.bind(this)}>
                TEST CALL
                <Image ml={3} height="0.8em" src={DualArrowSrc} />
              </CallButton>
            ) : (
              <Text fontSize="12px">{result}</Text>
            )}
          </Box>
        </Flex>

        <Box style={{ borderBottom: 'solid 1px #E8E9F8' }} py={3} />

        <Flex mt={4} justifyContent="center">
          <Button variant="gradient" onClick={onNext}>
            COMMIT
            <Image ml={3} height="0.8em" src={RightArrowSrc} />
          </Button>
        </Flex>
      </Container>
    )
  }
}
