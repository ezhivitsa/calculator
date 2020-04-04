import React, { Component, ReactNode } from 'react';

import { CalculatorStore, CalculationStore } from 'stores';

import { CalculatorStoreProvider, CalculationStoreProvider } from './providers';
import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <CalculatorStoreProvider value={new CalculatorStore()}>
        <CalculationStoreProvider value={new CalculationStore()}>
          <Calculator />
        </CalculationStoreProvider>
      </CalculatorStoreProvider>
    );
  }
}
