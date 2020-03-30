import React, { Component, ReactNode } from 'react';

import { CalculatorStore } from 'stores/calculator';

import { StoreProvider } from './provider';
import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <StoreProvider value={new CalculatorStore()}>
        <Calculator />
      </StoreProvider>
    );
  }
}
