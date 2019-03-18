import React from 'react'
import styled from 'styled-components'

import colors from 'ui/colors'
import { Box, Button, Text, Card } from 'ui/common'

import { connect } from 'react-redux'
import { proposeProposal } from 'actions'

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
  resize: none;
`

class ProposeModal extends React.Component {
  state = {
    title: '',
    reason: '',
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  onSubmit() {
    this.props.onSubmit(this.state.title, this.state.reason)
  }

  render() {
    return (
      <Card variant="modal">
        <Box px={4} pt={3} width="430px" height="460px">
          <Text
            color={colors.purple.normal}
            fontSize={0}
            fontWeight="500"
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
            fontWeight="500"
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
        <Box px={3} my={3}>
          <Button
            variant="primary"
            style={{ width: '100%', height: '60px' }}
            onClick={this.onSubmit.bind(this)}
          >
            OK
          </Button>
        </Box>
      </Card>
    )
  }
}

const mapDispatchToProps = (dispatch, { communityAddress, changes }) => ({
  onSubmit: (title, reason) =>
    dispatch(proposeProposal(communityAddress, title, reason, changes)),
})

export default connect(
  null,
  mapDispatchToProps,
)(ProposeModal)
