import { REQUEST_STATE } from "../constants";

export const initialState = {
  fetchState: REQUEST_STATE.INITIAL,
  foodsList: [],
};

export const foodsActionsTypes = {
  FETCHING: "FETCHING",
  FETCH_SUCCESS: "FETCH_SUCCESS",
};

export const foodsReducer = (state, action) => {
  switch (action.type) {
    case foodsActionsTypes.FETCHING:
      return {
        ...state,
        fetchState: REQUEST_STATE.LOADING,
      };
    case foodsActionsTypes.FETCH_SUCCESS:
      return {
        fetchState: REQUEST_STATE.OK,
        foodsList: action.payload.foods,
      };
    default:
      throw new Error();
  }
};
