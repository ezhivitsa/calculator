import React, { ReactElement } from 'react';
import classnames from 'classnames';

import { CalculationHistory } from 'stores';

import { Expression } from 'components/global/expression';

import { ERROR } from 'constants/app';

import { numberButtonTexts } from 'texts';

import styles from './history-item.pcss';

interface Props {
  item: CalculationHistory;
  onClick: () => void;
}

export function HistoryItem({ item, onClick }: Props): ReactElement {
  const { expression, result } = item;
  const error = !result;

  function handleExpressionClick(): void {
    onClick();
    item.setExpressionAsCurrent();
  }

  function handleResultClick(): void {
    onClick();
    item.setResultAsCurrent();
  }

  return (
    <div className={styles.historyItem}>
      <button className={styles.historyItem__part} onClick={handleExpressionClick}>
        <Expression expression={expression} />
      </button>

      <span className={styles.historyItem__equals}>{numberButtonTexts.equals}</span>

      <button
        className={classnames(styles.historyItem__part, { [styles._disabled]: error })}
        onClick={handleResultClick}
      >
        {error ? ERROR : result}
      </button>
    </div>
  );
}
