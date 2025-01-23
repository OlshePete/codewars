import { IFile } from '@skif/utils';
import type { ClassValue } from 'clsx';

export interface IViewFiles {
  files: Array<IFile>;
  className?: ClassValue;
  isOpen?: boolean;
  color?: string;
  updateFiles: (files: IFile[]) => void;
}
