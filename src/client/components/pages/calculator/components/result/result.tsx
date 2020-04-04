import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';

import { useCalculationStore } from 'providers';

import { History } from './components/history';

import styles from './result.pcss';

export const Result = observer(
  (): ReactElement => {
    const { showResult, expression, result } = useCalculationStore();

    return (
      <div className={styles.result}>
        <History />

        {showResult && <div className={styles.result_topExpression}>{expression}</div>}
        <div className={styles.result__topExpression}>123</div>
        <div className={styles.result__expression}>{showResult ? result : expression}</div>
      </div>
    );
  },
);
