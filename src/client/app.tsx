import React, { Component, ReactNode } from 'react';

import { PresentationStoreProvider, CalculatorStoreProvider, HistoryStoreProvider } from './providers';
import { PresentationStore, CalculatorStore, HistoryStore } from 'stores';

import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <PresentationStoreProvider value={new PresentationStore()}>
        <CalculatorStoreProvider value={new CalculatorStore()}>
          <HistoryStoreProvider value={new HistoryStore()}>
            <Calculator />
          </HistoryStoreProvider>
        </CalculatorStoreProvider>
      </PresentationStoreProvider>
    );
  }
}
