import React, { useEffect, ReactElement, ReactNode } from 'react';

import { Button } from 'components/global/button';

import { Parentheses, PostfixModifier } from 'stores';
import { addParentheses, addPostfixModifier } from 'services/app/calculation.app-service';

import { KeyCodes } from 'constants/buttons';
import { buttonTexts, expressionTexts } from 'texts';

import styles from './extra-math-buttons.pcss';

export function ExtraMathButtons(): ReactElement {
  function handleParenthesesClick(parentheses: Parentheses): void {
    addParentheses(parentheses);
  }

  function handleModifierClick(modifier: PostfixModifier): void {
    addPostfixModifier(modifier);
  }

  const buttons = [
    {
      title: expressionTexts.leftParentheses,
      onClick: () => handleParenthesesClick(Parentheses.Left),
      keyCode: KeyCodes.LeftParentheses,
    },
    {
      title: expressionTexts.rightParentheses,
      onClick: () => handleParenthesesClick(Parentheses.Right),
      keyCode: KeyCodes.RightParentheses,
    },
    {
      title: buttonTexts.percent,
      onClick: () => handleModifierClick(PostfixModifier.Percent),
      keyCode: KeyCodes.Percent,
    },
  ];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === KeyCodes.Shift) {
        return;
      }

      const button = buttons.find((b): boolean => {
        return b.keyCode === event.key;
      });

      if (button) {
        button.onClick();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  function renderButtons(): ReactNode[] {
    return buttons.map((button): ReactNode => {
      return (
        <Button key={button.title} className={styles.extraMathButtons__btn} onClick={button.onClick} view="grey">
          {button.title}
        </Button>
      );
    });
  }

  return <div className={styles.extraMathButtons}>{renderButtons()}</div>;
}
