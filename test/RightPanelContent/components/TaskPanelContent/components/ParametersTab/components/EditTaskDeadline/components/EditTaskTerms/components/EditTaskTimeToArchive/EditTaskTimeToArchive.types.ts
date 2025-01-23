import { ITaskTimeframe } from '../../../../../../../../../../../../../types/tasksInterfaces';
import {
  IErrors,
  TaskErrors,
} from '../../../../../../../../../../../SkifTaskPanel/context2/useTaskPanelContext';

export interface IEditTaskTimeToArchive {
  timeframe: ITaskTimeframe;
  setTimeframe: (value: ITaskTimeframe) => void;
  setError?: (name: TaskErrors | Array<TaskErrors>, value: string | null) => void;
  errors?: IErrors;
}
