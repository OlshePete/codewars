import { IFile } from '@skif/utils';
import type { ClassValue } from 'clsx';

export interface IButtonAddFile {
  onlyIcon: boolean;
  label?: string;
  files: IFile[];
  setFiles: (files: Array<IFile>) => void;
  paths: (string | undefined)[];
  setPaths: (files: Array<string | undefined>) => void;
  disabled: boolean;
  className: ClassValue;
  attachFiles: (
    paths: string[],
    accept?: string | undefined,
    maxLength?: number | undefined,
  ) => Promise<IFile[]>;
}
