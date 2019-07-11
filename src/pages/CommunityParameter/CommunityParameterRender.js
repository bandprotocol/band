import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button, Image } from 'ui/common'
import colors from 'ui/colors'
import PageStructure from 'components/DataSetPageStructure'
import Select from 'react-select'
import CircleLoadingSpinner from 'components/CircleLoadingSpinner'
import ParameterList from 'components/ParameterList'
import EditPropose from 'images/edit-proposal.svg'
import GovernanceHeader from 'images/govenance-header.svg'

const selectStyles = {
  control: (styles, { menuIsOpen }) => ({
    ...styles,
    border: menuIsOpen ? '1px solid #5269ff' : '1px solid #fff',
    width: '260px',
    minHeight: '35px',
    borderRadius: '17.5px',
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
  singleValue: (styles, {}) => ({
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
  padding: 0;
  width: 210px;
  height: 40px;
  cursor: pointer;
`

const SubmitButton = styled(Button).attrs({
  variant: 'blue',
})`
  padding: 0;
  width: 100px;
  height: 40px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
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
      <Flex
        flexDirection="column"
        pl="52px"
        width="100%"
        style={{ height: '100%' }}
        justifyContent="center"
      >
        <Text
          fontSize="27px"
          color="white"
          fontWeight="900"
          width="50%"
          style={{ lineHeight: '38px' }}
        >
          Parameter
        </Text>
        <Text
          fontSize="18px"
          color="white"
          fontWeight="500"
          width="60%"
          style={{ lineHeight: '33px' }}
        >
          Spicy jalapeno bacon ipsum dolor amet meatball t-bone brisket, shank
          ground round tail strip steak tongue filet mignon hamburger. Cow
          drumstick ham pork turkey. wine pork loin shank kielbasa.
        </Text>
      </Flex>
    )}
    renderSubheader={() => (
      <Flex
        alignItems="center"
        justifyContent="space-between"
        color="#4a4a4a"
        width="100%"
        pl="52px"
        pr="20px"
        style={{ height: '60px' }}
      >
        <Text fontSize={1} color={colors.text.normal} mr={2}>
          Parameter Group:
        </Text>

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
                fontSize={1}
                color={colors.text.grey}
                px={3}
                mr={3}
                alignSelf="center"
                onClick={toggleEdit}
                style={{
                  borderRight: 'solid 1px #999eab',
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
        <Box m="100px auto 0px auto">
          <CircleLoadingSpinner radius="60px" />
        </Box>
      ) : (
        <React.Fragment>
          <Flex flexDirection="column" px={1} pb="20px">
            <Text fontSize="20px" fontWeight="600">
              {currentPrefix.label}
            </Text>
            {/* TODO: get info by current prefix */}
            <Text
              fontSize="15px"
              fontWeight="500"
              my={2}
              style={{ lineHeight: '25px' }}
            >
              Spicy jalapeno bacon ipsum dolor amet meatball t-bone brisket,
              shank ground round tail strip steak tongue filet mignon hamburger.
              Cow landjaeger salami jowl turkey spare ribs fatback biltong strip
              steak chuck meatball. Ribeye meatball turkey beef ribs. Kielbasa
              swine tri-tip, salami pancetta fatback venison alcatra flank
              sausage drumstick ham pork turkey.{' '}
            </Text>
          </Flex>
          <ParameterList
            prefix={currentPrefix}
            isEdit={isEdit}
            handleParameterChange={handleParameterChange}
            whiteCardStyle={{ width: '346px' }}
          />
        </React.Fragment>
      )}
    </Flex>
  </PageStructure>
)
