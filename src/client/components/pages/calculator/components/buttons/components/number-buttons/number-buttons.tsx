import React, { useEffect, ReactElement, ReactNode } from 'react';
import classnames from 'classnames';

import { Button } from 'components/global/button';

import { NumberValue } from 'stores';
import { calculateResult, setNumber } from 'services/app/calculation.app-service';

import { KeyCodes } from 'constants/buttons';

import { usePresentationStore } from 'providers';

import { numberButtonTexts } from 'texts';

import styles from './number-buttons.pcss';

const buttons: { text: string; value: NumberValue; keyCodes: string | string[] }[] = [
  {
    text: numberButtonTexts.seven,
    value: NumberValue.Seven,
    keyCodes: KeyCodes.Seven,
  },
  {
    text: numberButtonTexts.eight,
    value: NumberValue.Eight,
    keyCodes: KeyCodes.Eight,
  },
  {
    text: numberButtonTexts.nine,
    value: NumberValue.Nine,
    keyCodes: KeyCodes.Nine,
  },
  {
    text: numberButtonTexts.four,
    value: NumberValue.Four,
    keyCodes: KeyCodes.Four,
  },
  {
    text: numberButtonTexts.five,
    value: NumberValue.Five,
    keyCodes: KeyCodes.Five,
  },
  {
    text: numberButtonTexts.six,
    value: NumberValue.Six,
    keyCodes: KeyCodes.Six,
  },
  {
    text: numberButtonTexts.one,
    value: NumberValue.One,
    keyCodes: KeyCodes.One,
  },
  {
    text: numberButtonTexts.two,
    value: NumberValue.Two,
    keyCodes: KeyCodes.Two,
  },
  {
    text: numberButtonTexts.three,
    value: NumberValue.Three,
    keyCodes: KeyCodes.Three,
  },
  {
    text: numberButtonTexts.zero,
    value: NumberValue.Zero,
    keyCodes: KeyCodes.Zero,
  },
  {
    text: numberButtonTexts.dot,
    value: NumberValue.Dot,
    keyCodes: [KeyCodes.Dot, KeyCodes.Comma],
  },
];

export function NumberButtons(): ReactElement {
  const presentationStore = usePresentationStore();

  function handleResultClick(): void {
    calculateResult(presentationStore.expression);
    presentationStore.setAnimate();
  }

  function handleNumberClick(number: string): void {
    setNumber(number);
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
        handleNumberClick(button.value);
        return;
      }

      if (event.key === KeyCodes.Equals || event.key === KeyCodes.Enter) {
        handleResultClick();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  function renderButtons(): ReactNode {
    return buttons.map((button) => {
      return (
        <Button
          key={button.text}
          className={styles.numberButtons__btn}
          view="light"
          onClick={(): void => handleNumberClick(button.value)}
        >
          {button.text}
        </Button>
      );
    });
  }

  return (
    <div className={styles.numberButtons}>
      {renderButtons()}
      <Button
        className={classnames(styles.numberButtons__btn, styles._equalBtn)}
        view="blue"
        onClick={handleResultClick}
      >
        {numberButtonTexts.equals}
      </Button>
    </div>
  );
}
