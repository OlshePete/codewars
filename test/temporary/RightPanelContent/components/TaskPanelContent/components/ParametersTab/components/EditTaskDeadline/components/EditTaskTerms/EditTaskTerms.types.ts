import { IErrors, TaskErrors } from "../../../../../../../../../context/useTaskPanelContext";
import { ITaskTimeframe } from "../../../../../../../../../types/tasksInterfaces";

export interface IEditTaskTerms {
  timeframe: ITaskTimeframe;
  setTimeframe: (value: ITaskTimeframe) => void;
  errors?: IErrors;
  setError?: (name: TaskErrors | Array<TaskErrors>, value: string | null) => void;
  startDisabled: boolean;
}
