import { Box } from 'rebass'
import styled from 'styled-components'
import { media } from 'ui'

const PageContainer = styled(Box)`
  margin: 0 auto;
  flex: 1;
  width: 100%;
  ${p => p.bg && `background: ${p.bg};`}

  ${p =>
    !p.fullWidth &&
    `
    padding: ${p.padding ? p.padding : '18px 32px 48px'};
    max-width: ${p.withSidebar ? '1218px' : p.dashboard ? '1170px' : '1440px'};

    ${media.mobile} {
      padding: ${p.padding ? p.padding : '24px 12px'};
    }
  `}
`

export default PageContainer
