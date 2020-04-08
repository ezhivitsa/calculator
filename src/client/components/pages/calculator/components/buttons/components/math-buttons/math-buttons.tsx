import React, { ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { Button } from 'components/global/button';

import { MathAction, CleanAction } from 'stores';
import { useCalculationStore } from 'providers';

import { LONG_PRESS_TIMEOUT } from 'constants/app';

import styles from './math-buttons.pcss';

const buttons: MathAction[] = [MathAction.DIVIDE, MathAction.MULTIPLY, MathAction.MINUS, MathAction.PLUS];

export const MathButtons = observer(
  (): ReactElement => {
    const calculationStore = useCalculationStore();
    let timeout: number | null = null;

    function handleButtonClick(action: MathAction): void {
      calculationStore.addAction(action);
    }

    function handleCleanMouseDown(): void {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        timeout = null;
        calculationStore.cleanAll();
      }, LONG_PRESS_TIMEOUT);
    }

    function handleCleanMouseUp(): void {
      if (!timeout) {
        return;
      }

      clearTimeout(timeout);
      timeout = null;

      if (!calculationStore.showResult) {
        calculationStore.clean();
      } else {
        calculationStore.cleanAll();
      }
    }

    function renderCleanButton(): ReactNode {
      const text = calculationStore.showResult ? CleanAction.CLEAN_RESULT : CleanAction.CLEAN_ONE;
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
        (button, index): ReactNode => {
          return (
            <Button key={index} className={styles.mathButtons__btn} onClick={(): void => handleButtonClick(button)}>
              {button}
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
