import React, { ReactElement, ReactNode } from 'react';

import { Button } from 'components/global/button';

import { MathAction } from 'stores';

import styles from './math-buttons.pcss';

const buttons: MathAction[] = [MathAction.DIVIDE, MathAction.MULTIPLY, MathAction.MINUS, MathAction.PLUS];

export function MathButtons(): ReactElement {
  function handleButtonClick(action: MathAction): void {}

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

  return <div className={styles.mathButtons}>{renderButtons()}</div>;
}
