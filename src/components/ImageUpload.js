import React from 'react'
import Dropzone from 'react-dropzone'
import { Flex, Text, Image, Box } from 'ui/common'
import { colors } from 'ui'
import { IPFS } from 'band.js'
import ImageLogoSrc from 'images/picture.svg'

const parentStyle = {
  border: '2px dashed rgb(213, 219, 243)',
  borderRadius: '6px',
  backgroundColor: 'white',
}

const setIPFSUrl = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = error => reject(error)
    reader.onload = async () => {
      const arr = new Uint8Array(reader.result)
      const hash = await IPFS.uploadImageToIPFS(arr)
      resolve(hash)
    }
    reader.readAsArrayBuffer(file)
  })
}

export default class ImageUpload extends React.Component {
  state = {
    src: null,
  }

  async onImageDrop(files) {
    const { setImgHash } = this.props
    const file = files[0]
    try {
      const chainHash = await setIPFSUrl(file)
      const urlHash = IPFS.toIPFSHash(chainHash)
      this.setState({
        src: `https://ipfs.infura.io:5001/api/v0/cat/${urlHash}`,
      })
      setImgHash(chainHash)
    } catch (err) {
      alert('Upload jpeg or png only.')
    }
  }

  render() {
    const { src } = this.state
    const { description, width = 120, height = 120 } = this.props
    if (src === null) {
      return (
        <Dropzone
          multiple={false}
          accept="image/jpeg, image/png"
          onDrop={this.onImageDrop.bind(this)}
        >
          {({ getRootProps, getInputProps }) => {
            return (
              <div
                {...getRootProps({
                  style: { ...parentStyle, width: width, height: height },
                })}
              >
                <input {...getInputProps()} />

                <Flex
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                >
                  <Image src={ImageLogoSrc} pt={3} pb={2} />
                  <Text fontSize={0} color="#cbcfe3" textAlign="center">
                    {description}
                  </Text>
                </Flex>
              </div>
            )
          }}
        </Dropzone>
      )
    } else {
      return (
        <div
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: width,
            borderRadius: this.props.banner ? '8px' : '0px',
            height: height,
            boxShadow: this.props.banner ? '0 10px 17px 0 #e6e9f5' : '',
            position: 'relative',
          }}
        >
          <Flex
            bg="red"
            width="20px"
            justifyContent="center"
            alignItems="center"
            onClick={() => this.setState({ src: null })}
            style={{
              height: '20px',
              borderRadius: '50%',
              position: 'absolute',
              bottom: '-10px',
              right: '-5px',
              cursor: 'pointer',
            }}
          >
            <Text color="white">
              <i className="fas fa-times" />
            </Text>
          </Flex>
        </div>
      )
    }
  }
}
