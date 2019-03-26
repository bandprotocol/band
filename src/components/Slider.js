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
  state = {
    value: 0,
  }

  componentDidMount() {
    const { value: rawValue, min, max } = this.props
    const value = ((max - min) / 100) * rawValue
    this.setState({
      value,
    })
  }

  handleChange = (event, value) => {
    const { value: rawValue, min, max } = this.props
    this.props.onChange({
      target: {
        name: this.props.name,
        value: (value * (max - min)) / 100 + min,
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
