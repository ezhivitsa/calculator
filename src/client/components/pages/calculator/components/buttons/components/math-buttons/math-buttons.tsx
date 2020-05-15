import React, { ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { Button } from 'components/global/button';

import { MathOperation } from 'stores';
import { addAction, cleanAll, clean } from 'services/app/calculation.app-service';
import { useHistoryStore } from 'providers';

import { LONG_PRESS_TIMEOUT } from 'constants/app';
import { operationTexts, cleanButtonTexts } from 'texts';

import styles from './math-buttons.pcss';

const buttons: {
  type: MathOperation;
  text: string;
}[] = [
  { type: MathOperation.Divide, text: operationTexts.divide },
  { type: MathOperation.Multiply, text: operationTexts.multiply },
  { type: MathOperation.Minus, text: operationTexts.minus },
  { type: MathOperation.Plus, text: operationTexts.plus },
];

export const MathButtons = observer(
  (): ReactElement => {
    const { lastCalculatedExpression } = useHistoryStore();

    let timeout: number | null = null;

    function handleButtonClick(action: MathOperation): void {
      addAction(action);
    }

    function handleCleanMouseDown(): void {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        timeout = null;
        cleanAll();
      }, LONG_PRESS_TIMEOUT);
    }

    function handleCleanMouseUp(): void {
      if (!timeout) {
        return;
      }

      clearTimeout(timeout);
      timeout = null;

      if (!lastCalculatedExpression) {
        clean();
      } else {
        cleanAll();
      }
    }

    function renderCleanButton(): ReactNode {
      const text = lastCalculatedExpression ? cleanButtonTexts.cleanResult : cleanButtonTexts.cleanOne;
      return (
        <Button
          className={classnames(styles.mathButtons__btn, styles._clean)}
          onMouseDown={handleCleanMouseDown}
          onMouseUp={handleCleanMouseUp}
        >
          {text}
        </Button>
      );
    }

    function renderButtons(): ReactNode[] {
      return buttons.map(
        (buttonData, index): ReactNode => {
          return (
            <Button
              key={index}
              className={styles.mathButtons__btn}
              onClick={(): void => handleButtonClick(buttonData.type)}
            >
              {buttonData.text}
            </Button>
          );
        },
      );
    }

    return (
      <div className={styles.mathButtons}>
        {renderCleanButton()}
        {renderButtons()}
      </div>
    );
  },
);
