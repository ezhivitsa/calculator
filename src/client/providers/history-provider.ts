import { createContext, useContext } from 'react';

import { HistoryStore } from 'stores/history';

export const HistoryStoreContext = createContext(new HistoryStore());
export const HistoryStoreProvider = HistoryStoreContext.Provider;

export const useHistoryStore = (): HistoryStore => useContext(HistoryStoreContext);
