import type { ClassValue } from 'clsx';
import type { IFile } from '../../../types/tasksInterfaces';

export interface IViewFiles {
  files: Array<IFile>;
  className?: ClassValue;
  isOpen?: boolean;
  color?: string;
  updateFiles: (files: IFile[]) => void;
}
