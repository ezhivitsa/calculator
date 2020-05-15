import React, { useState, useEffect, useRef, ReactElement, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

import { useHistoryStore } from 'providers';

import { historyTexts } from 'texts';

import { HistoryItem } from './components/history-item';

import styles from './history.pcss';

export const History = observer(
  (): ReactElement => {
    const [showItems, setShowItems] = useState(false);
    const [hasScroll, setHasScroll] = useState(false);

    const history = useHistoryStore();

    const container = useRef<HTMLDivElement>(null);
    const historyContainer = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
      const { current } = historyContainer;
      if (current) {
        const hasVerticalScrollbar = current.scrollHeight > current.clientHeight;
        if (hasVerticalScrollbar !== hasScroll) {
          setHasScroll(hasVerticalScrollbar);
        }
      }
    });

    function handleToggleShowItems(): void {
      setShowItems(!showItems);
    }

    function handleItemClick(): void {
      setShowItems(false);
    }

    function renderItems(): ReactNode | ReactNode[] {
      const { historyItems } = history;
      if (!historyItems.length) {
        return <div className={styles.history__placeholder}>{historyTexts.noItems}</div>;
      }

      return historyItems.map(
        (item, index): ReactElement => {
          return <HistoryItem key={index} item={item} onClick={handleItemClick} />;
        },
      );
    }

    function renderHistoryItems(): ReactNode {
      if (!showItems) {
        return null;
      }

      return (
        <div className={styles.history__items}>
          <div
            className={classnames(styles.history__itemsContainer, { [styles._hasScroll]: hasScroll })}
            ref={historyContainer}
          >
            {renderItems()}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.history} ref={container}>
        <button
          className={classnames(styles.history__btn, { [styles._historyVisible]: showItems })}
          onClick={handleToggleShowItems}
        >
          <FontAwesomeIcon icon={faHistory} />
        </button>

        {renderHistoryItems()}
      </div>
    );
  },
);
