import React, { ReactElement } from 'react';
import classnames from 'classnames';

import styles from './toggle.pcss';

interface ToggleItem<T> {
  text: string;
  value: T;
}

interface Props<T> {
  className?: string;
  items: ToggleItem<T>[];
  value: T;
  onChange?: (value: T) => void;
}

export function Toggle<T>(props: Props<T>): ReactElement {
  function handleItemClick(item: ToggleItem<T>): void {
    if (props.onChange) {
      props.onChange(item.value);
    }
  }

  function renderItems(): ReactElement[] {
    return props.items.map(
      (item): ReactElement => {
        const isActive = item.value === props.value;

        return (
          <div
            key={item.text}
            className={classnames(styles.toggle__item, { [styles._active]: isActive })}
            onClick={() => handleItemClick(item)}
          >
            {item.text}
          </div>
        );
      },
    );
  }

  return <div className={classnames(styles.toggle, props.className)}>{renderItems()}</div>;
}
