import { IErrors, TaskErrors } from "../../../../../../../../../../../context/useTaskPanelContext";
import { ITaskTimeframe } from "../../../../../../../../../../../types/tasksInterfaces";

export interface IEditTaskTimeToArchive {
  timeframe: ITaskTimeframe;
  setTimeframe: (value: ITaskTimeframe) => void;
  setError?: (name: TaskErrors | Array<TaskErrors>, value: string | null) => void;
  errors?: IErrors;
}
