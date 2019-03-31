import React from 'react'
import { Flex, Text } from 'ui/common'
import styled from 'styled-components'
import CurveSelection from 'components/CurveSelection'
import CurveGraph from 'components/CurveGraph'
import CurveParameter from 'components/CurveParameter'
import CurveEquation from 'components/CurveEquation'
import colors from 'ui/colors'

const TabMenu = styled(Text).attrs(props => ({
  mx: '16px',
  my: '10px',
  fontSize: '14px',
  fontWeight: props.active ? '500' : '300',
  color: props.active ? colors.purple.dark : colors.dark,
}))`
  height: 25px;
  border-bottom: ${p => (p.active ? `2px solid ${colors.purple.dark}` : '0px')};
  cursor: pointer;
  pointer-events: ${p => (p.active ? 'none' : 'auto')};
`

export default ({
  tab,
  switchTab,
  curve,
  type,
  params,
  onParamChange,
  setCurveType,
}) => (
  <Flex
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    mb={5}
  >
    <Flex width="535px" mt="40px" flexDirection="column" alignItems="center">
      <Text fontSize={3} color={colors.purple.dark} fontWeight="500">
        Token distribution
      </Text>
      <Text
        fontSize="16px"
        fontWeight={300}
        textAlign="center"
        mt="10px"
        lineHeight={1.69}
        letterSpacing={0.6}
      >
        This is a description of Token distribution page.
      </Text>
    </Flex>
    <CurveSelection type={type} setCurveType={setCurveType} />
    <Flex flexDirection="row">
      {/* Left Section */}
      <Flex flexDirection="column" mx={3}>
        <Text
          fontSize={3}
          color={colors.purple.dark}
          fontWeight="500"
          mt={5}
          mb={3}
        >
          Parameters
        </Text>
        <Flex
          flexDirection="column"
          width="320px"
          bg="#f4f6ff"
          style={{ height: '480px' }}
        >
          <CurveParameter
            type={type}
            values={params}
            onChange={onParamChange}
          />
        </Flex>
        <Text
          fontSize={3}
          color={colors.purple.dark}
          fontWeight="500"
          mt={4}
          mb={3}
        >
          Price Equation
        </Text>
        <Flex
          flexDirection="column"
          width="320px"
          bg="#f4f6ff"
          alignItems="center"
          justifyContent="center"
          mb={5}
          style={{ height: '90px' }}
        >
          <CurveEquation type={type} params={params} />
        </Flex>
      </Flex>
      {/* Right Section */}
      <Flex flexDirection="column" mx={3}>
        <Text
          fontSize={3}
          color={colors.purple.dark}
          fontWeight="500"
          mt={5}
          mb={3}
        >
          {type === 'linear'
            ? 'Linear'
            : type === 'poly'
            ? 'Polynomial'
            : 'Sigmoid'}{' '}
          Curve Generator
        </Text>
        <Flex
          flexDirection="column"
          bg="#f4f6ff"
          alignItems="center"
          justifyContent="center"
          p={3}
          mb={5}
        >
          {/* Graph Tab */}
          <Flex
            flexDirection="row"
            alignItems="center"
            width="700px"
            mx={4}
            mt={2}
          >
            <TabMenu
              active={tab === 'priceCurve'}
              onClick={() => switchTab('priceCurve')}
            >
              Price Curve Graph
            </TabMenu>
            <TabMenu
              active={tab === 'collateralCurve'}
              onClick={() => switchTab('collateralCurve')}
            >
              Collateral Curve Graph
            </TabMenu>
          </Flex>
          {/* Graph */}
          {tab === 'priceCurve' ? (
            <CurveGraph
              title=""
              xLabel="Token Supply"
              yLabel="Price"
              dataset={curve.dataset.bondingCurve}
              xDataset={curve.dataset.xDataSet}
              config={curve.priceGraphConfig}
              width={720}
              height={500}
            />
          ) : (
            <CurveGraph
              title=""
              xLabel="Token Supply"
              yLabel="Collateral"
              dataset={
                console.log('y', curve.dataset.collateralCurve) ||
                curve.dataset.collateralCurve
              }
              xDataset={
                console.log('x', curve.dataset.xDataSet) ||
                curve.dataset.xDataSet
              }
              config={curve.collateralGraphConfig}
              width={720}
              height={500}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  </Flex>
)
