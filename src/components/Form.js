import styled from 'styled-components'
import colors from 'ui/colors'
import { Text, Box } from 'ui/common'

export const Field = styled(Box)`
  margin-bottom: 12px;
`

export const Label = styled(Text).attrs({
  py: 2,
  px: 1,
  mb: 1,
})`
  font-size: 0.9em;
  color: ${props => props.color || colors.purple.normal};
  font-weight: 700;
`

export const Input = styled.input`
  display: block;
  border-radius: 4px;
  border: ${p => (p.error ? 'solid 1px red' : 'solid 1px #e7ecff')};
  font-size: 0.9em;
  line-height: 2.4em;
  padding: ${props => props.p || '0 1.2em'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
  background-color: ${props => props.bg || '#ffffff'};

  ::placeholder {
    color: #cbcfe3;
  }

  &:disabled {
    background-color: ${props => props.disabledBg || '#eff2f9'};
    color: ${props => props.disabledColor || '#cbcfe3'};
  }
`
export const TextArea = styled.textarea`
  display: block;
  border-radius: 4px;
  border: solid 1px #e7ecff;
  font-size: 0.9em;
  line-height: 1.6em;
  padding: 0.6em 1.2em;
  display: block;
  resize: none;
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};

  &:disabled {
    background-color: ${props => props.disabledBg || '#ffffff'};
    color: ${props => props.disabledColor || '#4a4a4a'};
  }

  ::placeholder {
    color: #cbcfe3;
  }
`
