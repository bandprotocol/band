import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button, Image, H3, H5 } from 'ui/common'
import PageStructure from 'components/DataSetPageStructure'
import Select from 'react-select'
import { getDescription } from 'data/parameters'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import ParameterList from 'components/ParameterList'
import EditPropose from 'images/edit-proposal.svg'
import GovernanceHeader from 'images/govenance-header.svg'
import DataHeader from 'components/DataHeader'
import { FormattedMessage } from 'react-intl'

const selectStyles = {
  control: (styles, { menuIsOpen }) => ({
    ...styles,
    border: menuIsOpen ? '1px solid #5269ff' : '1px solid #fff',
    width: '260px',
    minHeight: '32px',
    borderRadius: '16px',
    '&:hover': {
      borderColor: '#5269ff',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    transition: 'all .2s ease',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
    padding: '2px 9px',
    color: '#5269ff',
    width: '90%',
    height: '70%',
    '&:hover': {
      color: '#5269ff',
    },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: '#fff',
  }),
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    fontSize: '14px',
    color: isSelected ? '#5269ff' : '#4a4a4a',
    fontWeight: isSelected ? '600' : '400',
    backgroundColor: isSelected ? '#f3f7ff' : isFocused ? '#f7f9fc' : '#fff',
    padding: '8px 22px',
  }),
  singleValue: styles => ({
    ...styles,
    paddingLeft: '10px',
    width: '100%',
    color: '#4a4a4a',
    fontWeight: '600',
    fontSize: '14px',
  }),
}

const ProposeButton = styled(Button).attrs({
  variant: 'gradientBlue',
})`
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
  height: 34px;
  padding: 0 18px 2px;
  align-self: flex-end;
  margin-bottom: 2px;
`

const SubmitButton = styled(Button).attrs({
  variant: 'gradientBlue',
})`
  font-size: 13px;
  font-weight: 700;
  display: inline-block;
  height: 34px;
  padding: 0 12px 2px;
  align-self: flex-end;
  margin-bottom: 2px;
`

export default ({
  name,
  tokenAddress,
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
  <PageStructure
    name={name}
    communityAddress={tokenAddress}
    breadcrumb={{ path: 'parameters', label: 'Parameters' }}
    renderHeader={() => (
      <DataHeader
        lines={[
          'Parameters:',
          'Decentralized Configurations for Smart Contract',
          'Community agrees on how smart contracts work though parameters.',
          'Token holders can propose a change, which initiate a community-wide vote.',
        ]}
      />
    )}
    renderSubheader={() => (
      <Flex
        alignItems="center"
        justifyContent="space-between"
        color="#4a4a4a"
        width="100%"
        pl="52px"
        pr="20px"
      >
        <H5 mr="12px" color="#4a4a4a" fontWeight="600" pb={1}>
          <FormattedMessage id="Parameter Group"></FormattedMessage>
        </H5>
        <Select
          value={currentPrefix}
          options={prefixList}
          onChange={onChangePrefix}
          isDisabled={isEdit}
          styles={selectStyles}
          isSearchable={false}
        />
        <Flex ml="auto">
          {isEdit ? (
            <Flex>
              <Box
                color="#4a4a4a"
                px={3}
                mr={3}
                alignSelf="center"
                onClick={toggleEdit}
                style={{
                  borderRight: 'solid 1px #999eab',
                  lineHeight: 1.45,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'bio-sans',
                  paddingBottom: '2px',
                }}
              >
                <FormattedMessage id="Cancel"></FormattedMessage>
              </Box>
              <SubmitButton onClick={submitChanges}>
                <FormattedMessage id="Submit"></FormattedMessage>
              </SubmitButton>
            </Flex>
          ) : (
            <ProposeButton onClick={logedin ? toggleEdit : signin}>
              <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                style={{ fontFamily: 'bio-sans' }}
              >
                <Image src={EditPropose} height="18px" mr={2} />
                <FormattedMessage id="Propose Change"></FormattedMessage>
              </Flex>
            </ProposeButton>
          )}
        </Flex>
      </Flex>
    )}
    headerImage={GovernanceHeader}
  >
    <Flex
      width="100%"
      bg="#fff"
      flexDirection="column"
      my={3}
      p="30px"
      style={{
        borderRadius: '8px',
        border: 'solid 1px #e7ecff',
        overflow: 'hidden',
        boxShadow: '0 2px 9px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      {currentPrefix === null ? (
        <Box m="100px auto 0px auto" style={{ height: 400 }}>
          <CircleLoadingSpinner radius="60px" />
        </Box>
      ) : (
        <React.Fragment>
          <Flex flexDirection="column" px={1} pb="20px">
            <H3 color="#4a4a4a">{currentPrefix.label}</H3>
            <Text
              fontSize="15px"
              fontWeight="500"
              my={2}
              style={{ lineHeight: '25px' }}
            >
              <FormattedMessage
                id={getDescription(currentPrefix.label).info}
              ></FormattedMessage>
            </Text>
          </Flex>
          <ParameterList
            prefix={currentPrefix}
            isEdit={isEdit}
            handleParameterChange={handleParameterChange}
            whiteCardStyle={{ width: '346px', maxWidth: 'calc(33.33% - 20px)' }}
          />
        </React.Fragment>
      )}
    </Flex>
  </PageStructure>
)
