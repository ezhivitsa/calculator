import { createContext, useContext } from 'react';

import { CalculationStore } from 'stores';

export const CalculationStoreContext = createContext(new CalculationStore());
export const CalculationStoreProvider = CalculationStoreContext.Provider;

export const useCalculationStore = (): CalculationStore => useContext(CalculationStoreContext);
