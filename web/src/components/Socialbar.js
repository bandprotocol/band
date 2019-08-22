import React from 'react'
import styled from 'styled-components'
import { Flex, Box, AbsoluteLink } from 'ui/common'
import { isMobile } from 'ui/media'

// Outline icons
import TwitterOutline from 'images/twitter-outline.svg'
import TelegramOutline from 'images/telegram-outline.svg'
import GithubOutline from 'images/github-outline.svg'
import RedditOutline from 'images/reddit-outline.svg'

// Filled icons
import Reddit from 'images/reddit.svg'
import Telegram from 'images/telegram.svg'
import Github from 'images/github.svg'
import Twitter from 'images/twitter.svg'

const ToggleIcon = styled(Box)`
  width: 30px;
  height: 30px;
  background-image: url(${p => p.outline});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  transition: all 250ms;

  &:hover {
    background-image: url(${p => p.filled});
  }
`
const _isMobile = isMobile()

export default () => (
  <Flex
    alignItems="center"
    justifyContent="space-between"
    flex={1}
    width={_isMobile ? '200px' : 'unset'}
    style={{ maxWidth: '200px' }}
  >
    <AbsoluteLink href="https://t.me/joinchat/E48nA06UIBFmNsE9OaDusQ">
      <ToggleIcon outline={TelegramOutline} filled={Telegram} />
    </AbsoluteLink>
    <AbsoluteLink href="https://www.reddit.com/r/bandprotocol">
      <ToggleIcon outline={RedditOutline} filled={Reddit} />
    </AbsoluteLink>
    <AbsoluteLink href="https://github.com/bandprotocol">
      <ToggleIcon outline={GithubOutline} filled={Github} />
    </AbsoluteLink>
    <AbsoluteLink href="https://twitter.com/bandprotocol">
      <ToggleIcon outline={TwitterOutline} filled={Twitter} />
    </AbsoluteLink>
  </Flex>
)
