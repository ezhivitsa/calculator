import React, { useState, useEffect, ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { PrefixModifier, MathConstant, MeasurementType, PostfixModifier } from 'stores';
import {
  addPrefixModifier,
  addConstant,
  setMeasurement,
  addPostfixModifier,
  addExponent,
  addPower,
  addPowerForConstant,
  addPowerForValue,
  addValuePower,
  addRoot,
} from 'services/app/calculation.app-service';

import { useCalculatorStore, useHistoryStore } from 'providers';

import { buttonTexts, measurementTypeTexts } from 'texts/buttons';
import { KeyCodes } from 'constants/buttons';

import { Button } from 'components/global/button';
import { Toggle } from 'components/global/toggle';

import styles from './scientific-buttons.pcss';

interface ButtonData {
  title: ReactNode;
  onClick: () => void;
  inverse?: boolean;
  keyCodes?: string | string[];
}

export const ScientificButtons = observer((): ReactElement => {
  const [showInverse, setShowInverse] = useState(false);

  const calculator = useCalculatorStore();
  const history = useHistoryStore();

  function handleModifierClick(modifier: PrefixModifier): void {
    addPrefixModifier(modifier);
    setShowInverse(false);
  }

  function handleConstantClick(constant: MathConstant, value: string | null = null): void {
    addConstant(constant, value);
  }

  function handleInverseClick(): void {
    setShowInverse(!showInverse);
  }

  function handleMeasurementChange(measurement: MeasurementType): void {
    setMeasurement(measurement);
  }

  function handlePostfixModifierClick(modifier: PostfixModifier): void {
    addPostfixModifier(modifier);
  }

  function handleExpClick(): void {
    addExponent();
  }

  function handleAddPower(): void {
    addPower();
  }

  function handleAddPowerForConstant(constant: MathConstant): void {
    addPowerForConstant(constant);
    setShowInverse(false);
  }

  function handleAddPowerForValue(value: string): void {
    addPowerForValue(value);
    setShowInverse(false);
  }

  function handleAddValuePower(value: string): void {
    addValuePower(value);
    setShowInverse(false);
  }

  function handleAddRoot(): void {
    addRoot();
    setShowInverse(false);
  }

  const buttons: ButtonData[] = [
    {
      title: `${buttonTexts.x}${buttonTexts.factorial}`,
      onClick: () => handlePostfixModifierClick(PostfixModifier.Factorial),
      keyCodes: KeyCodes.ExclamationPoint,
    },
    {
      title: buttonTexts.inversion,
      onClick: handleInverseClick,
    },
    {
      title: buttonTexts.sinus,
      inverse: false,
      onClick: () => handleModifierClick(PrefixModifier.Sin),
      keyCodes: KeyCodes.S,
    },
    {
      title: (
        <span>
          <span>{buttonTexts.sinus}</span>
          <sup>{buttonTexts.minusOne}</sup>
        </span>
      ),
      inverse: true,
      onClick: () => handleModifierClick(PrefixModifier.Asin),
      keyCodes: KeyCodes.BigS,
    },
    {
      title: buttonTexts.logarithmNatural,
      inverse: false,
      onClick: () => handleModifierClick(PrefixModifier.Ln),
      keyCodes: [KeyCodes.L, KeyCodes.BigL],
    },
    {
      title: (
        <span>
          <span>{buttonTexts.e}</span>
          <sup>{buttonTexts.x}</sup>
        </span>
      ),
      inverse: true,
      onClick: () => handleAddPowerForConstant(MathConstant.E),
    },
    {
      title: buttonTexts.pi,
      onClick: () => handleConstantClick(MathConstant.Pi),
      keyCodes: [KeyCodes.P, KeyCodes.BigP],
    },
    {
      title: buttonTexts.cosine,
      inverse: false,
      onClick: () => handleModifierClick(PrefixModifier.Cos),
      keyCodes: KeyCodes.C,
    },
    {
      title: (
        <span>
          <span>{buttonTexts.cosine}</span>
          <sup>{buttonTexts.minusOne}</sup>
        </span>
      ),
      inverse: true,
      onClick: () => handleModifierClick(PrefixModifier.Acos),
      keyCodes: KeyCodes.BigC,
    },
    {
      title: buttonTexts.logarithm,
      inverse: false,
      onClick: () => handleModifierClick(PrefixModifier.Log),
      keyCodes: [KeyCodes.G, KeyCodes.BigG],
    },
    {
      title: (
        <span>
          <span>10</span>
          <sup>{buttonTexts.x}</sup>
        </span>
      ),
      inverse: true,
      onClick: () => handleAddPowerForValue('10'),
    },
    {
      title: buttonTexts.e,
      onClick: () => handleConstantClick(MathConstant.E),
      keyCodes: KeyCodes.E,
    },
    {
      title: buttonTexts.tangent,
      inverse: false,
      onClick: () => handleModifierClick(PrefixModifier.Tan),
      keyCodes: KeyCodes.T,
    },
    {
      title: (
        <span>
          <span>{buttonTexts.tangent}</span>
          <sup>{buttonTexts.minusOne}</sup>
        </span>
      ),
      inverse: true,
      onClick: () => handleModifierClick(PrefixModifier.Atan),
      keyCodes: KeyCodes.BigT,
    },
    {
      title: buttonTexts.sqrt,
      inverse: false,
      onClick: () => handleModifierClick(PrefixModifier.SquareRoot),
    },
    {
      title: (
        <span>
          <span>{buttonTexts.x}</span>
          <sup>{buttonTexts.square}</sup>
        </span>
      ),
      inverse: true,
      onClick: () => handleAddValuePower('2'),
    },
    {
      title: buttonTexts.ans,
      inverse: false,
      onClick: () => handleConstantClick(MathConstant.Answer, history.lastNumericResult),
      keyCodes: [KeyCodes.A, KeyCodes.BigA],
    },
    {
      title: buttonTexts.rnd,
      inverse: true,
      onClick: () => handleConstantClick(MathConstant.Random),
      keyCodes: KeyCodes.BigR,
    },
    {
      title: buttonTexts.exp,
      onClick: handleExpClick,
      keyCodes: KeyCodes.BigE,
    },
    {
      title: (
        <span>
          <span>{buttonTexts.x}</span>
          <sup>{buttonTexts.y}</sup>
        </span>
      ),
      inverse: false,
      onClick: handleAddPower,
    },
    {
      title: (
        <span>
          <sup>y</sup>
          <span>
            {buttonTexts.sqrt}
            {buttonTexts.x}
          </span>
        </span>
      ),
      inverse: true,
      onClick: handleAddRoot,
      keyCodes: KeyCodes.R,
    },
  ];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === KeyCodes.Shift) {
        return;
      }

      const button = buttons.find((b): boolean => {
        if (b.keyCodes instanceof Array) {
          return b.keyCodes.includes(event.key);
        }

        return b.keyCodes !== undefined && b.keyCodes === event.key;
      });

      if (button) {
        button.onClick();
        return;
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  function renderButtons(): ReactNode[] {
    return buttons
      .filter((button) => button.inverse === undefined || button.inverse === showInverse)
      .map((button, index): ReactNode => {
        return (
          <Button key={index} className={styles.scientificButtons__btn} onClick={button.onClick}>
            {button.title}
          </Button>
        );
      });
  }

  function renderToggle(): ReactNode {
    return (
      <Toggle
        className={styles.scientificButtons__toggle}
        items={[
          {
            text: measurementTypeTexts.rad,
            value: MeasurementType.Rad,
          },
          {
            text: measurementTypeTexts.deg,
            value: MeasurementType.Deg,
          },
        ]}
        value={calculator.measurementType}
        onChange={handleMeasurementChange}
      />
    );
  }

  return (
    <div className={styles.scientificButtons}>
      {renderToggle()}
      {renderButtons()}
    </div>
  );
});
