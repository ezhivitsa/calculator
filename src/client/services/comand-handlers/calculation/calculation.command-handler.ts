import {
  AddMathOperationCommand,
  AddModifierCommand,
  AddConstantCommand,
  EventType,
  MathConstant,
  MathAction,
  CommandType,
  CommandTypeMapping,
} from 'stores/types';

import { handle } from 'services/command-bus';
import { apply } from 'services/event-bus';
import { getEvents } from 'services/event-store';

import {
  shouldAddMultiplyForConstant,
  isValueNumber,
  newValue,
  canAddSign,
  canAddOperation,
  canAddRightParentheses,
  dispose,
} from './calculation.state';

import { restore } from 'services/event-bus';
import { removeLastEvent, removeAllEvents } from 'services/event-store';

import { actionsStore } from 'stores/actions';
import { presentationStore } from 'stores/presentation';
import { historyStory } from 'stores/history';

handle(CommandType.ADD_VALUE, (command: CommandTypeMapping[CommandType.ADD_VALUE]): void => {
  if (shouldAddMultiplyForConstant()) {
    if (!isValueNumber(command.value)) {
      return;
    }
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: MathAction.MULTIPLY,
    });
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: command.value,
      value: command.value,
    });
    return;
  }
  const resultValue = newValue(command.value);
  if (!resultValue) {
    return;
  }
  apply({
    type: EventType.VALUE_CHANGED,
    addedValue: command.value,
    value: resultValue,
  });
});

handle(CommandType.ADD_MATH_OPERATION, (command: AddMathOperationCommand): void => {
  if (canAddSign(command.operation)) {
    apply({
      type: EventType.VALUE_CHANGED,
      addedValue: '-',
      value: '-',
    });
    return;
  }

  if (canAddOperation()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: command.operation,
    });
  }
});

handle(CommandType.ADD_LEFT_PARENTHESES, (): void => {
  apply({
    type: EventType.LEFT_PARENTHESES_ADDED,
  });
});

handle(CommandType.ADD_RIGHT_PARENTHESES, (): void => {
  if (!canAddRightParentheses()) {
    return;
  }

  apply({
    type: EventType.RIGHT_PARENTHESES_ADDED,
  });
});

handle(CommandType.REMOVE_SYMBOL, (): void => {
  removeLastEvent();

  dispose();
  actionsStore.dispose();
  presentationStore.dispose();

  restore();
});

handle(CommandType.REMOVE_ALL_SYMBOLS, (): void => {
  removeAllEvents();

  dispose();
  actionsStore.dispose();
  presentationStore.dispose();

  restore();
});

handle(CommandType.ADD_MODIFIER, (command: AddModifierCommand): void => {
  apply({
    type: EventType.MODIFIER_ADDED,
    modifier: command.modifier,
  });
});

handle(CommandType.ADD_MATH_CONSTANT, (command: AddConstantCommand): void => {
  if (shouldAddMultiplyForConstant()) {
    apply({
      type: EventType.MATH_OPERATION_ADDED,
      operation: MathAction.MULTIPLY,
    });
  }

  if (command.constant === MathConstant.RANDOM) {
    const value = Math.random().toString();

    apply({
      type: EventType.MATH_CONSTANT_ADDED,
      constant: MathConstant.RANDOM,
      value,
    });
    return;
  }

  if (command.constant === MathConstant.ANSWER) {
    const value = historyStory.lastNumericResult;

    if (value) {
      apply({
        type: EventType.MATH_CONSTANT_ADDED,
        constant: MathConstant.ANSWER,
        value,
      });
    }
    return;
  }

  apply({
    type: EventType.MATH_CONSTANT_ADDED,
    constant: command.constant,
  });
});

handle(
  CommandType.CALCULATE_RESULT,
  async (): Promise<void> => {
    const result = await actionsStore.calculateResult();
    const { expression } = presentationStore;

    apply({
      type: EventType.RESULT_CALCULATED,
      result,
      expression,
      events: getEvents(),
    });
  },
);

// export class CalculationCommandHandler {
//   private _events: Event[] = [];

//   private _applicationState = new ApplicationState();

//   private _apply(event: Event, shouldAdd = true): void {
//     if (shouldAdd) {
//       this._events.push(event);
//     }

//     switch (event.type) {
//       case EventType.VALUE_CHANGED:
//         this._applicationState.handleValueChanged(event as ValueChangedEvent);
//         actionsStore.handleValueChanged(event as ValueChangedEvent);
//         presentationStore.handleValueChanged(event as ValueChangedEvent);
//         break;

//       case EventType.MATH_OPERATION_ADDED:
//         this._applicationState.handleOperationAdded(event as OperationAddedEvent);
//         actionsStore.handleOperationAdded(event as OperationAddedEvent);
//         presentationStore.handleOperationAdded(event as OperationAddedEvent);
//         break;

//       case EventType.LEFT_PARENTHESES_ADDED:
//         this._applicationState.handleLeftParenthesesAdded();
//         actionsStore.handleLeftParenthesesAdded();
//         presentationStore.handleLeftParenthesesAdded();
//         break;

//       case EventType.RIGHT_PARENTHESES_ADDED:
//         this._applicationState.handleRightParenthesesAdded();
//         actionsStore.handleRightParenthesesAdded();
//         presentationStore.handleRightParenthesesAdded();
//         break;

//       case EventType.MODIFIER_ADDED:
//         this._applicationState.handleModifierAdded(event as ModifierAddedEvent);
//         actionsStore.handleModifierAdded(event as ModifierAddedEvent);
//         presentationStore.handleModifierAdded(event as ModifierAddedEvent);
//         break;

//       case EventType.RESULT_CALCULATED:
//         presentationStore.handleResultCalculated(event as ResultCalculatedEvent);
//         historyStory.handleResultCalculated(event as ResultCalculatedEvent);
//         break;

//       case EventType.MATH_CONSTANT_ADDED:
//         this._applicationState.handleMathConstantAdded();
//         actionsStore.handleMathConstantAdded(event as MathConstantAddedEvent);
//         presentationStore.handleMathConstantAdded(event as MathConstantAddedEvent);
//         break;

//       case EventType.RESULT_CLEARED:
//         presentationStore.handleResultCleared();
//         break;
//     }
//   }

//   private _dispose(): void {
//     this._applicationState.dispose();
//     actionsStore.dispose();
//     presentationStore.dispose();
//   }

//   private _restore(): void {
//     for (const event of this._events) {
//       this._apply(event, false);
//     }
//   }

//   handleSetValue(command: AddValueCommand): void {
//     if (this._applicationState.shouldAddMultiplyForConstant()) {
//       if (!this._applicationState.isNumber(command.value)) {
//         return;
//       }

//       this._apply({
//         type: EventType.MATH_OPERATION_ADDED,
//         operation: MathAction.MULTIPLY,
//       });
//       this._apply({
//         type: EventType.VALUE_CHANGED,
//         addedValue: command.value,
//         value: command.value,
//       });
//       return;
//     }

//     const newValue = this._applicationState.newValue(command.value);
//     if (!newValue) {
//       return;
//     }

//     this._apply({
//       type: EventType.VALUE_CHANGED,
//       addedValue: command.value,
//       value: newValue,
//     });
//   }

//   handleAddOperation(command: AddMathOperationCommand): void {
//     if (this._applicationState.canAddSign(command.operation)) {
//       this._apply({
//         type: EventType.VALUE_CHANGED,
//         addedValue: '-',
//         value: '-',
//       });
//       return;
//     }

//     if (this._applicationState.canAddOperation()) {
//       this._apply({
//         type: EventType.MATH_OPERATION_ADDED,
//         operation: command.operation,
//       });
//     }
//   }

//   handleAddLeftParentheses(): void {
//     this._apply({
//       type: EventType.LEFT_PARENTHESES_ADDED,
//     });
//   }

//   handleAddRightParentheses(): void {
//     if (!this._applicationState.canAddRightParentheses()) {
//       return;
//     }

//     this._apply({
//       type: EventType.RIGHT_PARENTHESES_ADDED,
//     });
//   }

//   handleRemoveSymbol(): void {
//     if (!this._events.length) {
//       return;
//     }

//     this._events.pop();

//     this._dispose();
//     this._restore();
//   }

//   handleRemoveAllSymbols(): void {
//     this._dispose();

//     this._apply({
//       type: EventType.RESULT_CLEARED,
//     });
//   }

//   handleAddModifier(command: AddModifierCommand): void {
//     this._apply({
//       type: EventType.MODIFIER_ADDED,
//       modifier: command.modifier,
//     });
//   }

//   handleAddMathConstant(command: AddConstantCommand): void {
//     if (this._applicationState.shouldAddMultiplyForConstant()) {
//       this._apply({
//         type: EventType.MATH_OPERATION_ADDED,
//         operation: MathAction.MULTIPLY,
//       });
//     }

//     if (command.constant === MathConstant.RANDOM) {
//       const value = Math.random().toString();

//       this._apply({
//         type: EventType.MATH_CONSTANT_ADDED,
//         constant: MathConstant.RANDOM,
//         value,
//       });
//       return;
//     }

//     if (command.constant === MathConstant.ANSWER) {
//       const value = historyStory.lastNumericResult;

//       if (value) {
//         this._apply({
//           type: EventType.MATH_CONSTANT_ADDED,
//           constant: MathConstant.ANSWER,
//           value,
//         });
//       }
//       return;
//     }

//     this._apply({
//       type: EventType.MATH_CONSTANT_ADDED,
//       constant: command.constant,
//     });
//   }

//   async handleCalculateResult(): Promise<void> {
//     const result = await actionsStore.calculateResult();
//     const { expression } = presentationStore;

//     this._apply({
//       type: EventType.RESULT_CALCULATED,
//       result,
//       expression,
//       events: [...this._events],
//     });
//   }
// }
