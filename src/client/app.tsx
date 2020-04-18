import React, { Component, ReactNode } from 'react';

import { CalculatorStore } from 'stores';

import { CalculatorStoreProvider, PresentationStoreProvider, presentationStore } from './providers';
import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <CalculatorStoreProvider value={new CalculatorStore()}>
        <PresentationStoreProvider value={presentationStore}>
          <Calculator />
        </PresentationStoreProvider>
      </CalculatorStoreProvider>
    );
  }
}
