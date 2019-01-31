import React from 'react'
import { withRouter } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Flex } from 'ui/common'

import ScrollToTop from 'ScrollToTop'
import Sidebar from 'containers/Sidebar'
import CommunityDetail from 'pages/Detail/CommunityDetail'
import CommunitiesPage from 'pages/Communities'

export default ({ match, location }) => (
  <React.Fragment>
    <ScrollToTop />
    <Switch location={location}>
      <Route
        path="/community/:community"
        render={({ match, history, location }) => (
          <React.Fragment>
            <Flex flexDirection="row">
              <Sidebar communityName={match.params.community} />
              <Switch>
                <Route
                  path="/community/:community/detail"
                  render={({ match }) => (
                    <CommunityDetail communityName={match.params.community} />
                  )}
                />
                <Route
                  path="/community/:community/reward"
                  render={({ match }) => <div>reward</div>}
                />
                <Route
                  path="/community/:community/governance"
                  render={({ match }) => <div>governance</div>}
                />
                <Route
                  path="/community/:community/proposal"
                  render={({ match }) => <div>proposal</div>}
                />
                <Route
                  path="/community/:community"
                  exact
                  render={({ match }) => (
                    <Redirect
                      to={`/community/${match.params.community}/detail`}
                    />
                  )}
                />
              </Switch>
            </Flex>
          </React.Fragment>
        )}
      />
      <Route exact path="/" component={CommunitiesPage} />
    </Switch>
  </React.Fragment>
)
