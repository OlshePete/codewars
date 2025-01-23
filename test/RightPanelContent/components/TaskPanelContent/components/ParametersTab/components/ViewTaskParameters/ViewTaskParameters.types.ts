import type { ClassValue } from 'clsx';
import type {
  IBaseTask,
  ITaskDiscus,
  ITaskPFFlow,
  ITaskProcess,
} from '../../../types/tasksInterfaces';

export interface IViewParameters {
  task: IBaseTask<ITaskDiscus> | IBaseTask<ITaskProcess> | IBaseTask<ITaskPFFlow> | null;
  className?: ClassValue;
  isOpen?: boolean;
  color?: string;
}
