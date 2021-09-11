import { observable, action, computed, makeObservable } from 'mobx';

import { handle } from 'services/event-bus';

import { EventType, MeasurementChangedEvent } from 'services/types';
import { MeasurementType } from './types';

export class CalculatorStore {
  @observable private _measurementType: MeasurementType = MeasurementType.Rad;

  constructor() {
    makeObservable(this);

    this._initHandlers();
  }

  private _initHandlers(): void {
    handle(EventType.MEASUREMENT_CHANGED, this._setMeasurementType);
  }

  @computed
  get measurementType(): MeasurementType {
    return this._measurementType;
  }

  @action
  private _setMeasurementType = ({ measurement }: MeasurementChangedEvent): void => {
    this._measurementType = measurement;
  };
}
