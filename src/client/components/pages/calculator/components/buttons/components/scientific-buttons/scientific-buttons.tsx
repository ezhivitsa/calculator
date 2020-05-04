import React, { useState, ReactElement, ReactNode } from 'react';

import { PrefixModifier, MathConstant } from 'stores';
import { addModifier, addConstant } from 'services/app/calculation.app-service';

import { buttonTexts } from 'texts/buttons';

import { Button } from 'components/global/button';

import styles from './scientific-buttons.pcss';

interface Button {
  title: ReactNode;
  onClick?: () => void;
  inverse: boolean | null;
}

export function ScientificButtons(): ReactElement {
  const [showInverse, setShowInverse] = useState(false);

  function handleModifierClick(modifier: PrefixModifier): void {
    addModifier(modifier);
    setShowInverse(false);
  }

  function handleConstantClick(constant: MathConstant): void {
    addConstant(constant);
  }

  function handleInverseClick(): void {
    setShowInverse(!showInverse);
  }

  const buttons: Button[] = [
    {
      title: buttonTexts.inversion,
      inverse: null,
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
      inverse: null,
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
      inverse: null,
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
      inverse: null,
    },
    {
      title: (
        <span>
          <span>{buttonTexts.x}</span>
          <sup>{buttonTexts.y}</sup>
        </span>
      ),
      inverse: false,
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
      .filter((button) => button.inverse === null || button.inverse === showInverse)
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

  return <div className={styles.scientificButtons}>{renderButtons()}</div>;
}
