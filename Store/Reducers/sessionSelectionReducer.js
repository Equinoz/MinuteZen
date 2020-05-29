// Reducer actualisant la séance en cours

const initialState = { currentSession: {} };

function sessionSelectionReducer (state = initialState, action) {
  switch(action.type) {
    case "UPDATE":
      let nextState = {
        ...state,
        currentSession: action.value
      };
      return nextState || state;
    default:
      return state;
  }
}

export default sessionSelectionReducer;