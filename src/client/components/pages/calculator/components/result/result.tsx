import React, { ReactElement } from 'react';

import { History } from './components/history';

import styles from './result.pcss';

export function Result(): ReactElement {
  return (
    <div className={styles.result}>
      <History />
    </div>
  );
}
