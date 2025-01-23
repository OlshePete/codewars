import { IMessageBase } from '../../../../../../../types/automationInterfaces';
import { IBaseTask } from '../../../../../../../types/tasksInterfaces';

export interface ITaskReportDialog {
  tasks: IBaseTask[];
  buttonClass?: string;
  buttonLabel?: string;
  modalLabel?: string;
  disabled?: boolean;
  onReject: () => void;
  onConfirm: (message?: IMessageBase) => void;
}
