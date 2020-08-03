import React from 'react';
import Context from "../store/context";
import { initialiseReducer } from '../store/reducer';
import Layout from './layout';
const App = () => {
  const { state, dispatch } = initialiseReducer();
  return (
    <Context.Provider value={{ state, dispatch }}>
      <Layout />
    </Context.Provider>
  )
}

export default App;