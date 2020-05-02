import React, { Component, ReactNode } from 'react';

import { PresentationStoreProvider } from './providers';
import { PresentationStore } from 'stores';

import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <PresentationStoreProvider value={new PresentationStore()}>
        <Calculator />
      </PresentationStoreProvider>
    );
  }
}
