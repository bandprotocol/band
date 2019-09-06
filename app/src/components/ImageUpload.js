import React from 'react'
import Dropzone from 'react-dropzone'
import { Flex, Text, Image } from 'ui/common'
import { IPFS } from 'band.js'
import ImageLogoSrc from 'images/upload-logo.svg'
import ImageBannerSrc from 'images/upload-banner.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const parentStyle = {
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
    src: this.props.imgUrl,
  }

  async onImageDrop(files) {
    const { setImgHash } = this.props
    const file = files[0]
    try {
      const chainHash = await setIPFSUrl(file)
      const urlHash = IPFS.toIPFSHash(chainHash)
      const imageSrc = `https://ipfs.bandprotocol.com/api/v0/cat/${urlHash}`
      this.setState({
        src: imageSrc,
      })
      // save image url
      this.props.saveImageUrl(imageSrc)
      // save image hash
      setImgHash(chainHash)
    } catch (err) {
      console.log(err)
      alert('Upload jpeg or png only.')
    }
  }

  removeImage() {
    this.setState({
      src: null,
    })
    this.props.removeImageUrl()
  }

  render() {
    const { src } = this.state
    const { width = 120, height = 120 } = this.props
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
                  {!this.props.banner ? (
                    <Image src={ImageLogoSrc} pt={3} pb={2} />
                  ) : (
                    <Image src={ImageBannerSrc} pt={3} pb={2} />
                  )}
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
            width="20px"
            justifyContent="center"
            alignItems="center"
            onClick={this.removeImage.bind(this)}
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
              <FontAwesomeIcon icon={faTimes} />
            </Text>
          </Flex>
        </div>
      )
    }
  }
}
