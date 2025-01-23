import { ClassValue } from 'clsx';
import { ITaskTag } from '../../../../../../../../../types/tasksInterfaces';

export interface IMembers {
  tags: Record<string, ITaskTag>;
  taskTags: Record<string, ITaskTag>;
  setTags: (tags: Record<string, ITaskTag>) => void;
  className?: ClassValue;
  color?: string;
}
