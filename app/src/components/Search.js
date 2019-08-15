import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Input = styled.input`
  width: ${props => props.width};
  line-height: 36px;
  border-radius: 10px;
  border: 1px solid #e5e6f5;
  font-size: 13px;
  padding-left: 10px;
  margin: 10px 0px;
  box-shadow: 0 4px 20px 0 #f4f4f4;

  &:placeholder {
    font-size: 16px;
  }
`

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
    }
    this.debounce = _.debounce(props.onSearch, 500)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
    this.debounce(value)
  }

  render() {
    return (
      <Input
        width={this.props.width || '150px'}
        name="address"
        placeholder="e.g. 0x..."
        onChange={this.handleChange.bind(this)}
        value={this.state.address}
      />
    )
  }
}
