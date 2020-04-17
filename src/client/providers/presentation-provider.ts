import { createContext, useContext } from 'react';

import { PresentationStore, presentationStore } from 'stores/presentation';

export const PresentationStoreContext = createContext(presentationStore);
export const PresentationStoreProvider = PresentationStoreContext.Provider;

export const usePresentationStore = (): PresentationStore => useContext(PresentationStoreContext);
export { presentationStore };
