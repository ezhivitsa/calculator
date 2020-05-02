import React, { useEffect, ReactElement } from 'react';

import { init } from 'services/app/calculation.app-service';

import { Result } from './components/result';
import { Buttons } from './components/buttons';

import styles from './calculator.pcss';

export function Calculator(): ReactElement {
  useEffect(() => {
    init();
  }, []);

  return (
    <div className={styles.calculator}>
      <Result />
      <Buttons />
    </div>
  );
}
