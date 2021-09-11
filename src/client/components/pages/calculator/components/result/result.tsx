import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { usePresentationStore, useHistoryStore } from 'providers';

import { buttonTexts } from 'texts';

import { Expression } from 'components/global/expression';

import { History } from './components/history';

import styles from './result.pcss';

export const Result = observer((): ReactElement => {
  const { expression, showTemplateForNewLevel, result, animate } = usePresentationStore();
  const { answer, lastCalculatedExpression } = useHistoryStore();

  return (
    <div className={styles.result}>
      <History />

      <div className={classnames(styles.result__topExpression, { [styles._animate]: animate })}>
        {lastCalculatedExpression ? (
          <>
            <Expression expression={lastCalculatedExpression} />
            <span> =</span>
          </>
        ) : (
          <>{answer && `${buttonTexts.ans} = ${answer}`}</>
        )}
      </div>

      <div className={classnames(styles.result__expression, { [styles._animate]: animate })}>
        <Expression
          expression={lastCalculatedExpression ? result : expression}
          showTemplateForNewLevel={showTemplateForNewLevel}
          highlightImaginaryPart
        />
      </div>
    </div>
  );
});
