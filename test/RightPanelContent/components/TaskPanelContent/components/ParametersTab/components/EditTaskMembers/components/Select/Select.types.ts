import { IUser } from '../../../../../../../../../../../types/esbInterfaces';
import { TaskErrors } from '../../../../../../../../../SkifTaskPanel/context2/useTaskPanelContext';

export interface ISelectMember {
  fullName: string;
  id: string;
}

export interface ISelectMembers {
  title: string;
  selected: Array<ISelectMember>;
  changeSelected: (value: Array<ISelectMember>) => void;
  userList?: Record<string, IUser> | null;
  errorExecutor?: string | null;
  setError?: (name: TaskErrors, value: string | null) => void;
  isDisabled?: boolean;
  excluded: ISelectMember[];
}
