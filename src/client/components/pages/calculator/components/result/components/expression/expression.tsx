import React, { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { ExpressionValue } from 'stores/types';

import { countParenthesis } from 'lib/strings';

import styles from './expression.pcss';

interface Props {
  expression: ExpressionValue[] | string;
  showTemplateForNewLevel?: boolean;
  highlightImaginaryPart?: boolean;
}

export const Expression = observer(
  (props: Props): ReactElement => {
    const { expression, highlightImaginaryPart } = props;
    let { showTemplateForNewLevel } = props;

    function renderImaginaryPart(openedParenthesis: number): ReactElement {
      return (
        <span key="imaginary-part" className={highlightImaginaryPart ? styles.expression__imaginary : undefined}>
          {''.padEnd(openedParenthesis, ')')}
        </span>
      );
    }

    function renderPowerTemplate(): ReactElement {
      return (
        <sup key="power-template" className={styles.expression__power}>
          □
        </sup>
      );
    }

    function renderExpression(expression: ExpressionValue[], renderLevel = 0, index = 0): ReactElement[] {
      const result: ReactElement[] = [];
      let openedParenthesis = 0;

      for (let i = index; i < expression.length; i += 1) {
        const { value, bold, level } = expression[i];

        if (level === renderLevel) {
          openedParenthesis += countParenthesis(value);

          result.push(
            <span
              key={i}
              className={classnames(styles.expression__part, {
                [styles._bold]: bold,
              })}
            >
              {value}
            </span>,
          );
        } else if (level === renderLevel + 1) {
          result.push(<sup key={`sup-${level}-${i}`}>{renderExpression(expression, level, i)}</sup>);

          while (i + 1 < expression.length && expression[i + 1].level !== renderLevel) {
            i += 1;
          }
        } else {
          break;
        }
      }

      if (showTemplateForNewLevel) {
        showTemplateForNewLevel = false;
        result.push(renderPowerTemplate());
      }

      if (openedParenthesis) {
        result.push(renderImaginaryPart(openedParenthesis));
      }

      return result;
    }

    return typeof expression === 'string' ? <span>{expression}</span> : <span>{renderExpression(expression)}</span>;
  },
);
