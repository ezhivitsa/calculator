import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';

import { usePresentationStore } from 'providers';

import { History } from './components/history';

import styles from './result.pcss';

export const Result = observer(
  (): ReactElement => {
    // const { showResult, expression, result } = usePresentationStore();
    const { expression, imaginaryEnd } = usePresentationStore();

    return (
      <div className={styles.result}>
        <History />

        {/* {showResult && <div className={styles.result__topExpression}>{expression}</div>}
        <div className={styles.result__expression}>{showResult ? result : expression}</div> */}

        <div className={styles.result__expression}>
          <span className={styles.result__real}>{expression}</span>
          <span className={styles.result__imaginary}>{imaginaryEnd}</span>
        </div>
      </div>
    );
  },
);
