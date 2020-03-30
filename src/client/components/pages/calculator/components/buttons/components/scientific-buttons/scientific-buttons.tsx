import React, { useState, ReactElement, ReactNode } from 'react';

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
    },
    {
      title: (
        <span>
          <span>{buttonTexts.sinus}</span>
          <sup>{buttonTexts.minusOne}</sup>
        </span>
      ),
      inverse: true,
    },
    {
      title: buttonTexts.logarithmNatural,
      inverse: false,
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
    },
    {
      title: buttonTexts.cosine,
      inverse: false,
    },
    {
      title: (
        <span>
          <span>{buttonTexts.cosine}</span>
          <sup>{buttonTexts.minusOne}</sup>
        </span>
      ),
      inverse: true,
    },
    {
      title: buttonTexts.logarithm,
      inverse: false,
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
    },
    {
      title: buttonTexts.tangent,
      inverse: false,
    },
    {
      title: (
        <span>
          <span>{buttonTexts.tangent}</span>
          <sup>{buttonTexts.minusOne}</sup>
        </span>
      ),
      inverse: true,
    },
    {
      title: buttonTexts.sqrt,
      inverse: false,
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
    },
    {
      title: buttonTexts.rnd,
      inverse: true,
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
