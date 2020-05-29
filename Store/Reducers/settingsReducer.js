// Reducer gérant les options

const initialState = { option: "sound", must_disable_airplane: false };

function settingsReducer(state = initialState, action) {
  let nextState;

  switch(action.type) {
    case "UPDATE":
      if (~["sound", "vibration", "both"].indexOf(action.value))
        nextState = {
          ...state,
          option: action.value
        };
      return nextState || state;

    case "SWITCH":
      nextState = {
        ...state,
        must_disable_airplane: action.value
      };
      return nextState || state;

    default:
      return state;
  }
}

export default settingsReducer;