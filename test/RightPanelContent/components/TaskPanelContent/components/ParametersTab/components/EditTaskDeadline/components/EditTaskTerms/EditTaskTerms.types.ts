import { ITaskTimeframe } from '../../../../../../../../../../../types/tasksInterfaces';
import {
  IErrors,
  TaskErrors,
} from '../../../../../../../../../SkifTaskPanel/context2/useTaskPanelContext';

export interface IEditTaskTerms {
  timeframe: ITaskTimeframe;
  setTimeframe: (value: ITaskTimeframe) => void;
  errors?: IErrors;
  setError?: (name: TaskErrors | Array<TaskErrors>, value: string | null) => void;
  startDisabled: boolean;
}
