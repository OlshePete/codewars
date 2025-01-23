import { ITaskHistory } from '../../../../../../../../../../../types/tasksInterfaces';

export interface IHistoryItem
  extends React.HTMLProps<HTMLDivElement>,
    Omit<ITaskHistory, 'typeHistory'> {
  onClickItem?: () => void;
}
