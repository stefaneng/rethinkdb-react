export const ADD_MESSAGE = 'ADD_MESSAGE';

export function addMessage(msg) {
  return { type: ADD_MESSAGE, msg };
}
