import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { usePresentationStore } from 'providers';

import { History } from './components/history';

import styles from './result.pcss';

export const Result = observer(
  (): ReactElement => {
    const { expression, imaginaryEnd, showResult, result } = usePresentationStore();

    function renderExpression(): ReactElement[] {
      return expression.map(
        ({ value, bold }): ReactElement => {
          return (
            <span
              key={value}
              className={classnames(styles.result__expressionPart, {
                [styles._bold]: bold,
              })}
            >
              {value}
            </span>
          );
        },
      );
    }

    return (
      <div className={styles.result}>
        <History />

        {showResult && (
          <div className={styles.result__topExpression}>
            <span>{renderExpression()}</span>
            <span>{imaginaryEnd}</span>
            <span> =</span>
          </div>
        )}
        <div className={styles.result__expression}>
          {showResult ? (
            <span>{result}</span>
          ) : (
            <>
              <span className={styles.result__real}>{renderExpression()}</span>
              <span className={styles.result__imaginary}>{imaginaryEnd}</span>
            </>
          )}
        </div>
      </div>
    );
  },
);
