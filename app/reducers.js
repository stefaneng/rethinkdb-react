import { combineReducers } from 'redux';
import { ADD_MESSAGE } from './actions';

const initialState = {
  messages: []
};

export function messageApp(state = initialState, action) {
  switch(action.type) {
  case ADD_MESSAGE:
    return {
        ...state,
      messages: [
          ...state.messages,
        {
          text: action.text
        }
      ]
    };
  default:
    return state;
  }
}
