import { createContext, useContext } from 'react';

import { CalculatorStore } from 'stores/calculator';

export const CalculatorStoreContext = createContext(new CalculatorStore());
export const CalculatorStoreProvider = CalculatorStoreContext.Provider;

export const useCalculatorStore = (): CalculatorStore => useContext(CalculatorStoreContext);
