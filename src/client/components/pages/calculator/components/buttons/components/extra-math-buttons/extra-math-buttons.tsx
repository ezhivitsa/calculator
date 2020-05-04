import React, { ReactElement, ReactNode } from 'react';

import { Button } from 'components/global/button';

import { Parentheses, PostfixModifier } from 'stores';
import { addParentheses, addModifier } from 'services/app/calculation.app-service';

import { buttonTexts } from 'texts';

import styles from './extra-math-buttons.pcss';

export function ExtraMathButtons(): ReactElement {
  function handleParenthesesClick(parentheses: Parentheses): void {
    addParentheses(parentheses);
  }

  function handleModifierClick(modifier: PostfixModifier): void {
    // addModifier(modifier);
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
      title: buttonTexts.percent,
      onClick: () => handleModifierClick(PostfixModifier.Percent),
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
