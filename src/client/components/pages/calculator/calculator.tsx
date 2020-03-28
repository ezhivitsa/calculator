import React, { ReactElement } from 'react';

import { Result } from './components/result';
import { Buttons } from './components/buttons';

import styles from './calculator.pcss';

export function Calculator(): ReactElement {
  return (
    <div className={styles.calculator}>
      <Result />
      <Buttons />
    </div>
  );
}
