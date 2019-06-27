import { take, fork } from 'redux-saga/effects'

export const dispatchAsync = (dispatch, obj) =>
  new Promise((resolve, reject) =>
    dispatch({
      ...obj,
      __resolve: resolve,
      __reject: reject,
    }),
  )

export function* takeEveryAsync(actionType, handler) {
  yield fork(function*() {
    while (true) {
      const action = yield take(actionType)
      yield fork(function*() {
        try {
          yield* handler(action)
          if (action.__resolve) action.__resolve()
        } catch (e) {
          if (action.__reject) action.__reject(e)
        }
      })
    }
  })
}
