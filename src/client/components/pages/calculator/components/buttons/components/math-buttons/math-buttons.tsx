import React, { useEffect, ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { Button } from 'components/global/button';

import { MathOperation } from 'stores';
import { addAction, cleanAll, clean } from 'services/app/calculation.app-service';
import { useHistoryStore } from 'providers';

import { LONG_PRESS_TIMEOUT } from 'constants/app';
import { KeyCodes } from 'constants/buttons';
import { operationTexts, cleanButtonTexts } from 'texts';

import styles from './math-buttons.pcss';

const buttons: {
  type: MathOperation;
  text: string;
  keyCodes: string | string[];
}[] = [
  { type: MathOperation.Divide, text: operationTexts.divide, keyCodes: KeyCodes.Divide },
  { type: MathOperation.Multiply, text: operationTexts.multiply, keyCodes: KeyCodes.Multiply },
  { type: MathOperation.Minus, text: operationTexts.minus, keyCodes: KeyCodes.Minus },
  { type: MathOperation.Plus, text: operationTexts.plus, keyCodes: KeyCodes.Plus },
];

export const MathButtons = observer((): ReactElement => {
  const history = useHistoryStore();
  const { lastCalculatedExpression } = history;

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
    history.removeLastExpression();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === KeyCodes.Shift) {
        return;
      }

      const button = buttons.find((b): boolean => {
        if (b.keyCodes instanceof Array) {
          return b.keyCodes.includes(event.key);
        }

        return b.keyCodes === event.key;
      });

      if (button) {
        handleButtonClick(button.type);
        return;
      }

      if (event.key === KeyCodes.Backspace) {
        clean();
        event.preventDefault();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

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
    return buttons.map((buttonData, index): ReactNode => {
      return (
        <Button
          key={index}
          className={styles.mathButtons__btn}
          onClick={(): void => handleButtonClick(buttonData.type)}
        >
          {buttonData.text}
        </Button>
      );
    });
  }

  return (
    <div className={styles.mathButtons}>
      {renderCleanButton()}
      {renderButtons()}
    </div>
  );
});
