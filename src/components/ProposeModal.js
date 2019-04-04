import React from 'react'
import styled from 'styled-components'

import colors from 'ui/colors'
import { Box, Button, Text, Card, Flex } from 'ui/common'

import { connect } from 'react-redux'
import { proposeProposal } from 'actions'

import ToolTip from 'components/ToolTip'

const TitleInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border-radius: 2px;
  border: solid 1px #cbcfe3;
  font-size: 12px;
`

const ReasonInput = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 12px 20px;
  border-radius: 2px;
  border: solid 1px #cbcfe3;
  font-size: 13px;
  line-height: 1.62;
  resize: none;
`
const ProposeButton = styled(Button)`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  box-shadow: 0 3px 5px 0 rgba(180, 187, 218, 0.5);
  background-color: #7c84a6;
  cursor: pointer;
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
        <Box p={4} width="430px" height="460px">
          <Text color={colors.text.normal} fontSize={0} fontWeight="500" mb={3}>
            Subject
          </Text>
          <TitleInput
            type="text"
            name="title"
            value={this.state.title}
            placeholder="your title"
            onChange={this.handleChange.bind(this)}
          />
          <Flex alignItems="flex-end" my={3}>
            <Text
              color={colors.text.normal}
              fontSize={0}
              fontWeight="500"
              mr={1}
            >
              Reason for Change
            </Text>
            <ToolTip
              size="12px"
              height="12px"
              fontSize="10px"
              bg="#7c84a6"
              textBg="#b2b6be"
              textColor="black"
              width="295px"
              bottom="12px"
              left={83}
              tip={{ left: 80 }}
            >
              Explain why you propose such changes to the community. This will
              appear along your proposed change for community members to make
              informed decision.
            </ToolTip>
          </Flex>
          <ReasonInput
            type="text"
            name="reason"
            value={this.state.reason}
            placeholder="your reason"
            onChange={this.handleChange.bind(this)}
          />
          <ProposeButton bg="#7c84a6" onClick={this.onSubmit.bind(this)} my={3}>
            OK
          </ProposeButton>
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
