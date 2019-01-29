import { combineReducers } from 'redux-immutable'

import band from 'reducers/band'
import community from 'reducers/community'
import current from 'reducers/current'

export default combineReducers({ band, community, current })
