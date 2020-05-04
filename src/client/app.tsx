import React, { Component, ReactNode } from 'react';

import { PresentationStoreProvider, CalculatorStoreProvider } from './providers';
import { PresentationStore, CalculatorStore } from 'stores';

import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <PresentationStoreProvider value={new PresentationStore()}>
        <CalculatorStoreProvider value={new CalculatorStore()}>
          <Calculator />
        </CalculatorStoreProvider>
      </PresentationStoreProvider>
    );
  }
}
