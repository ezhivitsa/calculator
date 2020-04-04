import React, { ReactElement, ReactNode, SyntheticEvent } from 'react';
import classnames from 'classnames';

import styles from './button.pcss';

interface Props {
  children?: ReactNode;
  className?: string;
  view?: 'grey' | 'light' | 'blue';
  onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  onMouseUp?: (event: SyntheticEvent<HTMLButtonElement>) => void;
}

export function Button({ children, className, view, onClick, onMouseDown, onMouseUp }: Props): ReactElement {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={classnames(styles.button, styles[`button_view_${view}`], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  view: 'grey',
};
