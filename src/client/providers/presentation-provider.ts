import { createContext, useContext } from 'react';

import { PresentationStore } from 'stores/presentation';

export const PresentationStoreContext = createContext(new PresentationStore());
export const PresentationStoreProvider = PresentationStoreContext.Provider;

export const usePresentationStore = (): PresentationStore => useContext(PresentationStoreContext);
