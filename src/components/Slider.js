import React from 'react'
import { Flex } from 'ui/common'
import { withStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/lab/Slider'

const styles = {
  root: {
    width: 270,
  },
  slider: {
    padding: '25px 0px',
  },
}

class SimpleSlider extends React.Component {
  handleChange = (event, value) => {
    const { min, max } = this.props
    const convertedValue = (value * (max - min)) / 100 + min
    const valueToFixed = Math.floor(convertedValue * 1000) / 1000
    this.props.onChange({
      target: {
        name: this.props.name,
        value: valueToFixed,
      },
    })
  }

  render() {
    const { classes, value } = this.props
    return (
      <Flex className={classes.root}>
        <Slider
          classes={{ container: classes.slider }}
          value={value}
          aria-labelledby="label"
          onChange={this.handleChange.bind(this)}
        />
      </Flex>
    )
  }
}

export default withStyles(styles)(SimpleSlider)
