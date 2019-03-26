import React from 'react'
import { Flex, Box, Text } from 'ui/common'
import styled from 'styled-components'
import CurveSelection from 'components/CurveSelection'
import CurveGraph from 'components/CurveGraph'
import CurveParameter from 'components/CurveParameter'
import CurveEquation from 'components/CurveEquation'
import colors from 'ui/colors'

const TabMenu = styled(Text).attrs({
  mx: '16px',
  my: '10px',
  fontSize: '14px',
  color: props => (props.active ? colors.purple.normal : colors.normal),
})`
  height: 25px;
  border-bottom: ${p =>
    p.active ? `2px solid ${colors.purple.normal}` : '0px'};
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
    <Text fontSize={3} color="#8868ff" fontWeight="500" mt={5} mb={3}>
      Token distribution
    </Text>
    <Text fontSize={1} color="#000000" fontWeight="200" mt={2} mb={3}>
      This is a description of Token distribution page.
    </Text>
    <CurveSelection type={type} setCurveType={setCurveType} />
    <Flex flexDirection="row">
      {/* Left Section */}
      <Flex flexDirection="column" mx={3}>
        <Text fontSize={3} color="#8868ff" fontWeight="500" mt={5} mb={3}>
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
        <Text fontSize={3} color="#8868ff" fontWeight="500" mt={4} mb={3}>
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
        <Text fontSize={3} color="#8868ff" fontWeight="500" mt={5} mb={3}>
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
              xDataset={curve.dataset.xDataSet}
              yDatasets={[
                { label: 'Bonding', data: curve.dataset.bondingCurve },
              ]}
            />
          ) : (
            <CurveGraph
              title=""
              xLabel="Token Supply"
              yLabel="Price"
              xDataset={curve.dataset.xDataSet}
              yDatasets={[
                {
                  label: 'Collateral',
                  data: curve.dataset.collateralCurve,
                },
              ]}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  </Flex>
)
