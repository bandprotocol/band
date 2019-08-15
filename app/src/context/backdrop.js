import React from 'react'

const { Provider, Consumer } = React.createContext({})

class BackdropProvider extends React.Component {
  state = {
    show: false,
  }

  showBackdrop() {
    this.setState({
      show: true,
    })
  }

  hideBackdrop() {
    this.setState({
      show: false,
    })
  }

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          showBackdrop: this.showBackdrop.bind(this),
          hideBackdrop: this.hideBackdrop.bind(this),
        }}
      >
        {this.props.children}
      </Provider>
    )
  }
}

export { BackdropProvider, Consumer as BackdropConsumer }
