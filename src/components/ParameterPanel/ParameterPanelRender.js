import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button, Image } from 'ui/common'
import colors from 'ui/colors'
import EditPropose from 'images/edit-proposal.svg'
import Select from 'react-select'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import ToolTip from 'components/ToolTip'
import ParameterList from 'components/ParameterList'

const PrefixSelect = styled(Select).attrs({
  isSearchable: false,
})`
  width: 200px;
  border-radius: 4px;
  border: solid 1px #e7ecff;
  background-color: #ffffff;
`

const ProposeButton = styled(Button).attrs({
  variant: 'grey',
})`
  padding: 0;
  width: 210px;
  height: 40px;
  cursor: pointer;
`

const SubmitButton = styled(Button).attrs({
  variant: 'grey',
})`
  padding: 0;
  width: 100px;
  height: 40px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
`

export default ({
  currentPrefix,
  prefixList,
  isEdit,
  onChangePrefix,
  toggleEdit,
  handleParameterChange,
  submitChanges,
  logedin,
  signin,
}) => (
  <Flex flexDirection="column" my={3}>
    <Flex alignItems="center">
      <Text color={colors.text.normal} fontSize={4} fontWeight="bold" mr={2}>
        Governance
      </Text>
      <ToolTip
        bg={colors.text.grey}
        width="410px"
        textBg="#b2b6be"
        textColor={colors.text.normal}
        bottom={20}
        left={20}
        tip={{ left: 21 }}
      >
        Public parameters that govern how community operates and functions.
        Community members can propose changes in parameters. Approved proposal
        requires over 80% participation and 30% accepted vote.
      </ToolTip>
    </Flex>

    {currentPrefix === null ? (
      <Box m="100px auto 0px auto">
        <CircleLoadingSpinner radius="60px" />
      </Box>
    ) : (
      <React.Fragment>
        <Flex py={4} alignItems="center">
          <Text fontSize={1} color={colors.text.normal} mr={2}>
            Parameter Group:
          </Text>

          <PrefixSelect
            value={currentPrefix}
            options={prefixList}
            onChange={onChangePrefix}
            isDisabled={isEdit}
          />
          <Flex ml="auto">
            {isEdit ? (
              <Flex>
                <Box
                  fontSize={1}
                  color={colors.text.grey}
                  px={3}
                  mr={3}
                  alignSelf="center"
                  onClick={toggleEdit}
                  style={{
                    borderRight: 'solid 2px #4e3ca9',
                    lineHeight: 1.45,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </Box>
                <SubmitButton onClick={submitChanges}>Submit</SubmitButton>
              </Flex>
            ) : (
              <ProposeButton onClick={logedin ? toggleEdit : signin}>
                <Flex
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image src={EditPropose} />
                  <Text ml="20px" fontSize="16px" font-weight="500">
                    Propose Change
                  </Text>
                </Flex>
              </ProposeButton>
            )}
          </Flex>
        </Flex>
        <ParameterList
          prefix={currentPrefix}
          isEdit={isEdit}
          handleParameterChange={handleParameterChange}
        />
      </React.Fragment>
    )}
  </Flex>
)
