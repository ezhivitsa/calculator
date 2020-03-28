import React, { useState, useEffect, useRef, ReactElement, ReactNode } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

import styles from './history.pcss';

export function History(): ReactElement {
  const [showItems, setShowItems] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent): void {
      const { current } = container;
      if (!(current && event.target instanceof HTMLElement)) {
        return;
      }

      if (!current.contains(event.target)) {
        setShowItems(false);
      }
    }

    document.addEventListener('click', handleDocumentClick);

    return function (): void {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  function handleToggleShowItems(): void {
    setShowItems(!showItems);
  }

  function renderHistoryItems(): ReactNode {
    if (!showItems) {
      return null;
    }

    return <div className={styles.history__items}>Text</div>;
  }

  return (
    <div className={styles.history} ref={container}>
      <button className={styles.history__btn} onClick={handleToggleShowItems}>
        <FontAwesomeIcon icon={faHistory} />
      </button>

      {renderHistoryItems()}
    </div>
  );
}
