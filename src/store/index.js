import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const initialState = {
  user: null,
  role: ""
}

function reducer(state = initialState, action) {
  switch(action.type) {
    case "set-user":
      return {...state, user: action.payload}
    case "set-role":
      return {...state, role: action.payload}
    default:
      return state
  }
}

const store = createStore(reducer, applyMiddleware(thunk))

export default store