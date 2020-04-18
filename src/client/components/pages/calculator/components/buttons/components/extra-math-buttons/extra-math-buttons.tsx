import React, { ReactElement, ReactNode } from 'react';

import { Button } from 'components/global/button';

import { Parentheses, MathModifier, calculationStore } from 'stores';

import styles from './extra-math-buttons.pcss';

export function ExtraMathButtons(): ReactElement {
  function handleParenthesesClick(parentheses: Parentheses): void {
    calculationStore.addParentheses(parentheses);
  }

  function handleModifierClick(modifier: MathModifier): void {
    calculationStore.addModifier(modifier);
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
      title: MathModifier.PERCENT,
      onClick: () => handleModifierClick(MathModifier.PERCENT),
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
