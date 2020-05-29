// Reducer gérant les séances

const initialState = { currentSession: {}, sessions: [], updatingSession: {}, periodToUpdate: null };

function sessionsReducer(state = initialState, action) {
  let nextState,
      newSession,
      sessions;

  switch(action.type) {
    case "SELECT":
      nextState = {
        ...state,
        currentSession: action.value
      };
      return nextState || state;

    case "ADD":
      newSession = { id: state.sessions.length, ...state.updatingSession };
      nextState = {
        ...state,
        sessions: [
          newSession,
          ...state.sessions
        ]
      };
      return nextState || state;

    case "UPDATE":
      nextState = {
        ...state,
        updatingSession: action.value
      };
      return nextState || state;

    case "VALID_UPDATING":
      sessions = [state.updatingSession, ...state.sessions.filter(session => session.id != state.updatingSession.id)];
      nextState = {
        ...state,
        sessions: sessions,
        updatingSession: {}
      };
      return nextState || state;

    case "DELETE":
      nextState = (state.currentSession.id == action.value) ? { currentSession: {} } : { ...state };

      sessions = state.sessions.filter(item => item.id != action.value);
      sessions.forEach((item, index) => item.id = index);

      nextState.sessions = sessions;
      nextState.updatingSession = {};
      return nextState || state;

    case "SELECT_PERIOD":
      nextState = {
        ...state,
        periodToUpdate: action.value
      };
      return nextState || state;

    default:
      return state;
  }
}

export default sessionsReducer;