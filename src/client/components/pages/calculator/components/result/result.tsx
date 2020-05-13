import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { usePresentationStore } from 'providers';

import { Expression } from 'components/global/expression';

import { History } from './components/history';

import styles from './result.pcss';

export const Result = observer(
  (): ReactElement => {
    const { expression, showTemplateForNewLevel, showResult, result } = usePresentationStore();

    return (
      <div className={styles.result}>
        <History />

        {showResult && (
          <div className={styles.result__topExpression}>
            <Expression expression={expression} />
            <span> =</span>
          </div>
        )}

        <div className={styles.result__expression}>
          <Expression
            expression={showResult ? result : expression}
            showTemplateForNewLevel={showTemplateForNewLevel}
            highlightImaginaryPart
          />
        </div>
      </div>
    );
  },
);
