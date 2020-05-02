import React, { Component, ReactNode } from 'react';

import { PresentationStoreProvider, presentationStore } from './providers';
import { Calculator } from './components/pages/calculator';

export class App extends Component {
  render(): ReactNode {
    return (
      <PresentationStoreProvider value={presentationStore}>
        <Calculator />
      </PresentationStoreProvider>
    );
  }
}
