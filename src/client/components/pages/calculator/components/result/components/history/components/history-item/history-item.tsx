import React, { ReactElement } from 'react';

import { CalculationHistory } from 'stores';

import { Expression } from 'components/global/expression';

import { numberButtonTexts } from 'texts';

import styles from './history-item.pcss';

interface Props {
  item: CalculationHistory;
  onClick: () => void;
}

export function HistoryItem({ item, onClick }: Props): ReactElement {
  const { expression, result } = item;

  function handleExpressionClick(): void {
    onClick();
  }

  function handleResultClick(): void {
    onClick();
  }

  return (
    <div className={styles.historyItem}>
      <button className={styles.historyItem__part} onClick={handleExpressionClick}>
        <Expression expression={expression} />
      </button>

      <span className={styles.historyItem__equals}>{numberButtonTexts.equals}</span>

      <button className={styles.historyItem__part} onClick={handleResultClick}>
        {result}
      </button>
    </div>
  );
}
