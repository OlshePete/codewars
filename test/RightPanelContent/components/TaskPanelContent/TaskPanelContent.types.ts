import { TViewTask } from '../../../../../types/tasksInterfaces';

export interface ITaskPanelContent {
  isEdit: boolean;
  setHideFooter: (status: boolean) => void; // eslint-disable-line no-unused-vars
  task: TViewTask;
}
