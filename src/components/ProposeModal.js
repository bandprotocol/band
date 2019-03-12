import React from 'react'
import styled from 'styled-components'

import colors from 'ui/colors'
import { Box, Button, Text, Card } from 'ui/common'

const TitleInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border-radius: 2px;
  border: solid 1px #cbcfe3;
  font-size: 16px;
  font-family: Montserrat, sans-serif;
`

const ReasonInput = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 12px 20px;
  border-radius: 2px;
  border: solid 1px #cbcfe3;
  font-size: 16px;
  font-family: Montserrat, sans-serif;
`

export default class ProposeModal extends React.Component {
  state = {
    title: '',
    reason: '',
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    return (
      <Card variant="modal">
        <Box px={4} pt={3}>
          <Text
            color={colors.purple.normal}
            fontSize={0}
            fontWeight="bold"
            mb={3}
          >
            Subject
          </Text>
          <TitleInput
            type="text"
            name="title"
            value={this.state.title}
            placeholder="your title"
            onChange={this.handleChange.bind(this)}
          />
          <Text
            color={colors.purple.normal}
            fontSize={0}
            fontWeight="bold"
            my={3}
          >
            Reason for Change
          </Text>
          <ReasonInput
            type="text"
            name="reason"
            value={this.state.reason}
            placeholder="your reason"
            onChange={this.handleChange.bind(this)}
          />
        </Box>
        <Box px={3} my={4}>
          <Button variant="primary" style={{ width: '100%' }}>
            OK
          </Button>
        </Box>
      </Card>
    )
  }
}
