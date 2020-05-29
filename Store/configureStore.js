// Configuration du store

import { createStore } from "redux";
import sessionsReducer from "./Reducers/sessionsReducer";
import settingsReducer from "./Reducers/settingsReducer";
import { persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage
};

export default createStore(persistCombineReducers(rootPersistConfig, { sessionsReducer, settingsReducer }));