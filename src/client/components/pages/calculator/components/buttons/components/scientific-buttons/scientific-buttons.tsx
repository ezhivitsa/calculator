import React, { useState, ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import { PrefixModifier, MathConstant, MeasurementType, PostfixModifier } from 'stores';
import {
  addPrefixModifier,
  addConstant,
  setMeasurement,
  addPostfixModifier,
  addExponent,
  addPower,
} from 'services/app/calculation.app-service';

import { useCalculatorStore } from 'providers';

import { buttonTexts, measurementTypeTexts } from 'texts/buttons';

import { Button } from 'components/global/button';
import { Toggle } from 'components/global/toggle';

import styles from './scientific-buttons.pcss';

interface Button {
  title: ReactNode;
  onClick?: () => void;
  inverse?: boolean;
}

export const ScientificButtons = observer(
  (): ReactElement => {
    const [showInverse, setShowInverse] = useState(false);
    const calculator = useCalculatorStore();

    function handleModifierClick(modifier: PrefixModifier): void {
      addPrefixModifier(modifier);
      setShowInverse(false);
    }

    function handleConstantClick(constant: MathConstant): void {
      addConstant(constant);
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

    const buttons: Button[] = [
      {
        title: `${buttonTexts.x}${buttonTexts.factorial}`,
        onClick: () => handlePostfixModifierClick(PostfixModifier.Factorial),
      },
      {
        title: buttonTexts.inversion,
        onClick: handleInverseClick,
      },
      {
        title: buttonTexts.sinus,
        inverse: false,
        onClick: () => handleModifierClick(PrefixModifier.Sin),
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
      },
      {
        title: buttonTexts.logarithmNatural,
        inverse: false,
        onClick: () => handleModifierClick(PrefixModifier.Ln),
      },
      {
        title: (
          <span>
            <span>{buttonTexts.e}</span>
            <sup>{buttonTexts.x}</sup>
          </span>
        ),
        inverse: true,
      },
      {
        title: buttonTexts.pi,
        onClick: () => handleConstantClick(MathConstant.PI),
      },
      {
        title: buttonTexts.cosine,
        inverse: false,
        onClick: () => handleModifierClick(PrefixModifier.Cos),
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
      },
      {
        title: buttonTexts.logarithm,
        inverse: false,
        onClick: () => handleModifierClick(PrefixModifier.Log),
      },
      {
        title: (
          <span>
            <span>10</span>
            <sup>{buttonTexts.x}</sup>
          </span>
        ),
        inverse: true,
      },
      {
        title: buttonTexts.e,
        onClick: () => handleConstantClick(MathConstant.E),
      },
      {
        title: buttonTexts.tangent,
        inverse: false,
        onClick: () => handleModifierClick(PrefixModifier.Tan),
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
      },
      {
        title: buttonTexts.ans,
        inverse: false,
        onClick: () => handleConstantClick(MathConstant.ANSWER),
      },
      {
        title: buttonTexts.rnd,
        inverse: true,
        onClick: () => handleConstantClick(MathConstant.RANDOM),
      },
      {
        title: buttonTexts.exp,
        onClick: handleExpClick,
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
      },
    ];

    function renderButtons(): ReactNode[] {
      return buttons
        .filter((button) => button.inverse === undefined || button.inverse === showInverse)
        .map(
          (button, index): ReactNode => {
            return (
              <Button key={index} className={styles.scientificButtons__btn} onClick={button.onClick}>
                {button.title}
              </Button>
            );
          },
        );
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
  },
);
