import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const initialState = {
  role: "",
  bookings:[],
  user: null,
  users: [],
  players: []
}

function reducer(state = initialState, action) {
  switch(action.type) {
    case "set-user":
      return {...state, user: action.payload}
    case "set-role":
      return {...state, role: action.payload}
    case "set-booking":
      return {...state, role: action.payload}
    case "set-users":
      return {...state, users: action.payload}
    case "set-players":
      return {...state, players: action.payload}
    default:
      return state
  }
}

const store = createStore(reducer, applyMiddleware(thunk))

export default store