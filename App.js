import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import SplashScreen from "react-native-splash-screen";
import Navigator from "./Navigation/Navigator";
import { Provider } from "react-redux";
import Store from "./Store/configureStore";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

export default function App() {
	useEffect(() => {
		SplashScreen.hide();
  }, []);

  let persistor = persistStore(Store);
  return (
    <Provider store={ Store } >
      <PersistGate persistor={ persistor }>
        <Navigator />
      </PersistGate>
    </Provider>
  );
};
