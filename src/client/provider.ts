import { createContext, useContext } from 'react';
import { CalculatorStore } from './stores/calculator';

export const StoreContext = createContext(new CalculatorStore());
export const StoreProvider = StoreContext.Provider;

export const useStore = (): CalculatorStore => useContext(StoreContext);
