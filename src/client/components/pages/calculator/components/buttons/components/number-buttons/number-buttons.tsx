import React, { ReactElement, ReactNode } from 'react';

import { Button } from 'components/global/button';

import { NumberValue } from 'stores';
import { useCalculationStore } from 'providers';

import styles from './number-buttons.pcss';

const buttons: NumberValue[] = [
  NumberValue.SEVEN,
  NumberValue.EIGHT,
  NumberValue.NINE,
  NumberValue.FOUR,
  NumberValue.FIVE,
  NumberValue.SIX,
  NumberValue.ONE,
  NumberValue.TWO,
  NumberValue.THREE,
  NumberValue.ZERO,
  NumberValue.DOT,
];

export function NumberButtons(): ReactElement {
  const calculationStore = useCalculationStore();

  function handleResultClick(): void {
    calculationStore.calculateResult();
  }

  function handleNumberClick(number: NumberValue): void {
    calculationStore.setNumber(number);
  }

  function renderButtons(): ReactNode {
    return buttons.map((button, index) => {
      return (
        <Button
          key={index}
          className={styles.numberButtons__btn}
          view="light"
          onClick={(): void => handleNumberClick(button)}
        >
          {button}
        </Button>
      );
    });
  }

  return (
    <div className={styles.numberButtons}>
      {renderButtons()}
      <Button className={styles.numberButtons__btn} view="blue" onClick={handleResultClick}>
        =
      </Button>
    </div>
  );
}
