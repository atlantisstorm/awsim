import { createContext } from "react";
import Context from './context';

describe('state context tests', () => {
  it('should be a context object', () => {
    const context = createContext();
    expect(Context).toMatchObject(context);
  })
});