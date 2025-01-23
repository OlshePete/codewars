import {
  ITaskHistory,
  TypesTask,
  TypesTaskHistory,
} from '../../../../../../../../../types/tasksInterfaces';

export type TClick = {
  taskId: string;
  subtaskId: string;
  typeHistory: TypesTaskHistory;
  subtaskType: TypesTask.PfFlow | TypesTask.Discus | TypesTask.Process;
};

export interface IViewHistory extends React.HTMLProps<HTMLDivElement> {
  history: ITaskHistory[];
  colorTask: string;
  onClickItem?: (arg: TClick) => void;
}
