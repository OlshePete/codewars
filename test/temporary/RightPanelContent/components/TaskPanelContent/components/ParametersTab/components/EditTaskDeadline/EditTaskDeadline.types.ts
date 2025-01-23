import type { ClassValue } from 'clsx';
import { ITaskTimeframe } from '../../../../../../../types/tasksInterfaces';
import { IErrors, TaskErrors } from '../../../../../../../context/useTaskPanelContext';

export enum TypesDeadline {
  OnlyEnd = 'onlyEnd',
  FullTerms = 'fullTerms',
}

export interface IDeadline {
  timeframe: ITaskTimeframe;
  setTimeframe: (value: ITaskTimeframe) => void;
  errors: IErrors;
  setError: (name: TaskErrors | Array<TaskErrors>, value: string | null) => void;
  className: ClassValue;
  color?: string;
  startDisabled: boolean;
}
