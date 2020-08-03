import React from 'react';
//import { render } from "@testing-library/react";
import Context from "../store/context";
import { initialiseReducer } from "../store/reducer";

export const RenderWithProvider = (props) => {
  const { children, testState, testDispatch }  = props;
  // Note: we pass any supplied testState to initialiseReducer rather than switching it like
  // we do for dispatch because of scoping.  Basically each rerender after a click/select
  // update event would mean we refresh again with the original data.
  const { state, dispatch: iDispatch } = initialiseReducer({ initialState: testState });
  const dispatch = testDispatch ? testDispatch : iDispatch;
  return (
    <Context.Provider value={{ state, dispatch }}>
      { children }
    </Context.Provider> 
  )
}