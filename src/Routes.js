import React from 'react'
import { withRouter } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router-dom'

import ScrollToTop from 'ScrollToTop'
import CommunityDetail from 'pages/Detail/CommunityDetail'
import CommunitiesPage from 'pages/Communities'

export default ({ match, location }) => (
  <React.Fragment>
    <ScrollToTop />
    <Switch location={location}>
      <Route
        path="/community/:community/detail"
        render={({ match, history }) => (
          <CommunityDetail communityName={match.params.community} />
        )}
      />
      <Route exact path="/" component={CommunitiesPage} />
    </Switch>
  </React.Fragment>
)
