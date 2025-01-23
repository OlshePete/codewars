import type { ClassValue } from 'clsx';
import { ITaskMember } from '../../../../../../../types/tasksInterfaces';
import { TaskErrors } from '../../../../../../../context/useTaskPanelContext';
import { IUser } from '../../../../../../../types/esbInterfaces';

export interface IMembers {
  members: Array<ITaskMember>;
  authorId: string;
  setMembers?: (members: Array<ITaskMember>) => void;
  className?: ClassValue;
  error?: string | null;
  setError?: (name: TaskErrors, value: string | null) => void;
  userList?: Record<string, IUser> | null;
  disabledObservers?: boolean;
  color?: string;
  onlyExecutor?: boolean;
}
