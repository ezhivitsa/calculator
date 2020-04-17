import React, { Component, ReactNode } from 'react';

import { CalculatorStore, CalculationStore } from 'stores';

import {
  CalculatorStoreProvider,
  CalculationStoreProvider,
  PresentationStoreProvider,
  presentationStore,
} from './providers';
import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <CalculatorStoreProvider value={new CalculatorStore()}>
        <CalculationStoreProvider value={new CalculationStore()}>
          <PresentationStoreProvider value={presentationStore}>
            <Calculator />
          </PresentationStoreProvider>
        </CalculationStoreProvider>
      </CalculatorStoreProvider>
    );
  }
}
