import React, { ReactElement, ReactNode } from 'react';

import { Button } from 'components/global/button';

import { Parentheses, MathAction } from 'stores';
import { useCalculationStore } from 'providers';

import styles from './extra-math-buttons.pcss';

export function ExtraMathButtons(): ReactElement {
  const calculation = useCalculationStore();

  function handleParenthesesClick(parentheses: Parentheses): void {
    calculation.addParentheses(parentheses);
  }

  function handleActionClick(action: MathAction): void {
    calculation.addAction(action);
  }

  const buttons = [
    {
      title: Parentheses.LEFT,
      onClick: () => handleParenthesesClick(Parentheses.LEFT),
    },
    {
      title: Parentheses.RIGHT,
      onClick: () => handleParenthesesClick(Parentheses.RIGHT),
    },
    {
      title: MathAction.PERCENT,
      onClick: () => handleActionClick(MathAction.PERCENT),
    },
  ];

  function renderButtons(): ReactNode[] {
    return buttons.map(
      (button): ReactNode => {
        return (
          <Button key={button.title} className={styles.extraMathButtons__btn} onClick={button.onClick} view="grey">
            {button.title}
          </Button>
        );
      },
    );
  }

  return <div className={styles.extraMathButtons}>{renderButtons()}</div>;
}
