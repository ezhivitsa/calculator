import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { usePresentationStore, useHistoryStore } from 'providers';

import { buttonTexts } from 'texts';

import { Expression } from 'components/global/expression';

import { History } from './components/history';

import styles from './result.pcss';

export const Result = observer(
  (): ReactElement => {
    const { expression, showTemplateForNewLevel, result } = usePresentationStore();
    const { answer, lastCalculatedExpression } = useHistoryStore();

    return (
      <div className={styles.result}>
        <History />

        {lastCalculatedExpression && (
          <div className={styles.result__topExpression}>
            <Expression expression={lastCalculatedExpression} />
            <span> =</span>
          </div>
        )}

        {!lastCalculatedExpression && answer && (
          <div className={styles.result__topExpression}>
            {buttonTexts.ans} = {answer}
          </div>
        )}

        <div className={styles.result__expression}>
          <Expression
            expression={lastCalculatedExpression ? result : expression}
            showTemplateForNewLevel={showTemplateForNewLevel}
            highlightImaginaryPart
          />
        </div>
      </div>
    );
  },
);
