import React from 'react'

export default class SliderLog extends React.Component {
  state = {
    value: '50',
  }

  render() {
    return <input type="range" placeholder="50" />
  }
}
