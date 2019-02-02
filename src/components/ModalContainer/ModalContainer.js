import React from 'react'
import ModalContainerRender from './ModalContainerRender'

class ModalContainer extends React.Component {
  state = {
    show: false,
    modal: null,
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      if (this.props.children) {
        this.setState({ show: true, modal: this.props.children })
      } else {
        this.setState({ show: false })
        await new Promise(r => setTimeout(r, 500))
        this.setState({ modal: null })
      }
    }
  }

  handleKeydownEvent = e => e.keyCode === 27 && this.props.hideModal()

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydownEvent, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydownEvent, false)
  }

  render() {
    console.log('State', this.state)
    console.log('Preops', this.props)
    return <ModalContainerRender {...this.state} {...this.props} />
  }
}

export default ModalContainer
