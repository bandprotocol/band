import React from 'react'
import { Flex, Text, Image } from 'ui/common'
import styled from 'styled-components'
import colors from 'ui/colors'

import LinearCurveActiveSrc from 'images/linearActive.svg'
import LinearCurveDisableSrc from 'images/linearDisable.svg'
import PolyCurveActiveSrc from 'images/polyActive.svg'
import PolyCurveDisableSrc from 'images/polyDisable.svg'
import SigmoidCurveActiveSrc from 'images/sigmoidActive.svg'
import SigmoidCurveDisableSrc from 'images/sidmoidDisable.svg'
import CorrectSrc from 'images/correct.svg'

const Pagecontainer = styled.div`
  width: 900px;
`

const ImageBox = styled(Flex).attrs({
  width: '200px',
  justifyContent: 'center',
  alignItems: 'center',
  mx: '32px',
  flexDirection: 'column',
})`
  border: ${p =>
    p.active ? `2px solid ${colors.purple.normal};` : `1px solid #cbcfe3;`}
  border-radius: 4px;
  height: 200px;
  cursor: pointer;
  position: relative;
`

const ImageCurve = styled(Image).attrs({
  width: '135px',
  height: '135px',
  mb: '10px',
})``

const CurveName = styled(Text).attrs({
  fontSize: '14px',
  letterSpcing: '0.53px',
  fontWeight: '500',
})`
  color: ${p => (p.active ? colors.purple.normal : '#cbcfe3')};
`

const CorrectIcon = ({ active }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    width="30px"
    bg={colors.purple.normal}
    style={{
      height: '30px',
      borderRadius: '50%',
      position: 'absolute',
      bottom: '-15px',
      right: '-15px',
      display: active ? 'flex' : 'none',
    }}
  >
    <Image src={CorrectSrc} />
  </Flex>
)

export default ({ type, setCurveType }) => (
  <Pagecontainer>
    <Flex justifyContent="center" alignItems="center" mt={5} mb={4}>
      <ImageBox
        active={type === 'linear'}
        onClick={() => setCurveType('linear')}
      >
        <ImageCurve
          src={type === 'linear' ? LinearCurveActiveSrc : LinearCurveDisableSrc}
        />
        <CurveName active={type === 'linear'}>Linear</CurveName>
        <CorrectIcon active={type === 'linear'} />
      </ImageBox>
      <ImageBox active={type === 'poly'} onClick={() => setCurveType('poly')}>
        <ImageCurve
          src={type === 'poly' ? PolyCurveActiveSrc : PolyCurveDisableSrc}
        />
        <CurveName active={type === 'poly'}>Polynomial</CurveName>
        <CorrectIcon active={type === 'poly'} />
      </ImageBox>
      <ImageBox
        active={type === 'sigmoid'}
        onClick={() => setCurveType('sigmoid')}
      >
        <ImageCurve
          src={
            type === 'sigmoid' ? SigmoidCurveActiveSrc : SigmoidCurveDisableSrc
          }
        />
        <CurveName active={type === 'sigmoid'}>Sigmoid</CurveName>
        <CorrectIcon active={type === 'sigmoid'} />
      </ImageBox>
    </Flex>
  </Pagecontainer>
)
