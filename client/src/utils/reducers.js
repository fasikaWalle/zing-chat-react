import { useReducer } from "react";
import { UPDATE_ROOMS, UPDATE_USERS, UPDATE_ROOM } from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_ROOM:
      return {
        ...state,
        rooms: [...state.rooms, action.room],
      };
    case UPDATE_ROOMS:
      const updatedState = [...state.rooms, ...action.rooms];
    
      return {
        ...state,
        rooms: updatedState,
      };

    case UPDATE_USERS:
      return {
        ...state,
        users: [...state.users, action.users],
      };

    default:
      return state;
  }
};

export function useChatReducer(initialState) {
  return useReducer(reducer, initialState);
}
