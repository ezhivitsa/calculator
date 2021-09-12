import React, { ReactElement, Fragment } from 'react';
import classnames from 'classnames';

import { ExpressionValue } from 'stores/types';

import { countParenthesis } from 'lib/strings';

import { expressionTexts } from 'texts';

import styles from './expression.pcss';

interface Props {
  expression: ExpressionValue[] | string;
  showTemplateForNewLevel?: boolean;
  highlightImaginaryPart?: boolean;
}

export function Expression(props: Props): ReactElement {
  const { expression, highlightImaginaryPart } = props;
  let { showTemplateForNewLevel } = props;

  function renderImaginaryPart(openedParenthesis: number): ReactElement {
    return (
      <span key="imaginary-part" className={highlightImaginaryPart ? styles.expression__imaginary : undefined}>
        {''.padEnd(openedParenthesis, expressionTexts.rightParentheses)}
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

  function renderNextLevel(expression: ExpressionValue[], level: number, index: number): ReactElement {
    return <sup key={`sup-${level}-${index}`}>{renderExpression(expression, level, index)}</sup>;
  }

  function renderExpressionPart(value: string, bold: boolean, key: number, insertBefore?: boolean): ReactElement {
    const shouldRenderPowerTemplate = insertBefore && showTemplateForNewLevel;

    if (shouldRenderPowerTemplate) {
      showTemplateForNewLevel = false;
    }

    return (
      <Fragment key={key}>
        {shouldRenderPowerTemplate && renderPowerTemplate()}
        <span
          className={classnames(styles.expression__part, {
            [styles._bold]: bold,
          })}
        >
          {value}
        </span>
      </Fragment>
    );
  }

  function renderExpression(expression: ExpressionValue[], renderLevel = 0, index = 0): ReactElement[] {
    const result: ReactElement[] = [];
    let openedParenthesis = 0;

    for (let i = index; i < expression.length; i += 1) {
      const { value, bold, level, insertBefore } = expression[i];

      if (level === renderLevel) {
        openedParenthesis += countParenthesis(value);
        result.push(renderExpressionPart(value, bold, i, insertBefore));
      } else if (level >= renderLevel + 1) {
        result.push(renderNextLevel(expression, renderLevel + 1, i));

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
}
