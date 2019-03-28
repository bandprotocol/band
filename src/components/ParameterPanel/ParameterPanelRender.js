import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button } from 'ui/common'
import colors from 'ui/colors'

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

const ProposeButton = styled(Button)`
  width: 210px;
  height: 40px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  box-shadow: 0 3px 5px 0 rgba(180, 187, 218, 0.5);
  background-color: #7c84a6;
`

const SubmitButton = styled(Button)`
  width: 100px;
  height: 40px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 300;
  border-radius: 4px;
  box-shadow: 0 9px 13px 0 rgba(136, 104, 255, 0.38);
  background-color: #8868ff;
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
      <ToolTip bg={colors.text.grey}>
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
              <ProposeButton
                onClick={logedin ? toggleEdit : signin}
                style={{ height: '40px' }}
              >
                <Flex justifyContent="center" alignItems="center">
                  <i className="far fa-edit" style={{ fontSize: '18px' }} />
                  <Text fontSize="14px" mx={2} fontWeight="200">
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
