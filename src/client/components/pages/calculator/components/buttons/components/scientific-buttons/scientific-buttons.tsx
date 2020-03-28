import React, { useState, ReactElement, ReactNode } from 'react';

import { buttonTexts } from 'texts/buttons';

import { Button } from 'components/global/button';

import styles from './scientific-buttons.pcss';

interface Button {
  title: ReactNode;
  onClick?: () => void;
  inverse?: boolean;
}

export function ScientificButtons(): ReactElement {
  const [showInverse, setShowInverse] = useState(false);

  function handleInverseClick(): void {
    setShowInverse(!showInverse);
  }

  const buttons: Button[] = [
    {
      title: buttonTexts.inversion,
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
          <sup>-1</sup>
        </span>
      ),
    },
    {
      title: buttonTexts.logarithmNatural,
    },
    {
      title: buttonTexts.pi,
    },
    {
      title: buttonTexts.cosine,
    },
    {
      title: buttonTexts.logarithm,
    },
    {
      title: buttonTexts.e,
    },
    {
      title: buttonTexts.tangent,
    },
    {
      title: buttonTexts.sqrt,
    },
    {
      title: buttonTexts.ans,
    },
    {
      title: buttonTexts.exp,
    },
    {
      title: (
        <span>
          <span>x</span>
          <sup>y</sup>
        </span>
      ),
    },
  ];

  function renderButtons(): ReactNode[] {
    return buttons.map(
      (button, index): ReactNode => {
        return (
          <Button key={index} className={styles.scientificButtons__btn}>
            {button.title}
          </Button>
        );
      },
    );
  }

  return <div className={styles.scientificButtons}>{renderButtons()}</div>;
}
