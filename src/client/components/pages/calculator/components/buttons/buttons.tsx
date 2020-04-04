import React, { ReactElement } from 'react';

import { ScientificButtons } from './components/scientific-buttons';
import { NumberButtons } from './components/number-buttons';
import { MathButtons } from './components/math-buttons';
import { ExtraMathButtons } from './components/extra-math-buttons';

import styles from './buttons.pcss';

export function Buttons(): ReactElement {
  return (
    <div className={styles.buttons}>
      <ScientificButtons />

      <div>
        <ExtraMathButtons />
        <NumberButtons />
      </div>

      <MathButtons />
    </div>
  );
}
