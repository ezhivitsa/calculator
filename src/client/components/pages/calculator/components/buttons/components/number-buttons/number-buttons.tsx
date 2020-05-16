import React, { ReactElement, ReactNode } from 'react';
import classnames from 'classnames';

import { Button } from 'components/global/button';

import { NumberValue } from 'stores';
import { calculateResult, setNumber } from 'services/app/calculation.app-service';

import { usePresentationStore } from 'providers';

import { numberButtonTexts } from 'texts';

import styles from './number-buttons.pcss';

const buttons: { text: string; value: NumberValue }[] = [
  {
    text: numberButtonTexts.seven,
    value: NumberValue.Seven,
  },
  {
    text: numberButtonTexts.eight,
    value: NumberValue.Eight,
  },
  {
    text: numberButtonTexts.nine,
    value: NumberValue.Nine,
  },
  {
    text: numberButtonTexts.four,
    value: NumberValue.Four,
  },
  {
    text: numberButtonTexts.five,
    value: NumberValue.Five,
  },
  {
    text: numberButtonTexts.six,
    value: NumberValue.Six,
  },
  {
    text: numberButtonTexts.one,
    value: NumberValue.One,
  },
  {
    text: numberButtonTexts.two,
    value: NumberValue.Two,
  },
  {
    text: numberButtonTexts.three,
    value: NumberValue.Three,
  },
  {
    text: numberButtonTexts.zero,
    value: NumberValue.Zero,
  },
  {
    text: numberButtonTexts.dot,
    value: NumberValue.Dot,
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
