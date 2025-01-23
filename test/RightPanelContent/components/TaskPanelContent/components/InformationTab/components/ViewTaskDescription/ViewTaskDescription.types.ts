import type { ClassValue } from 'clsx';
import { IFile } from '../../../types/tasksInterfaces';

export interface IViewDescription {
  content: string;
  className?: ClassValue;
  isOpen?: boolean;
  color?: string;
  isDescriptionBlank?: boolean;
  description?: {
    meta: {
      id: string;
    };
    payload: {
      files?: IFile[];
      value?: string;
    };
    type: string;
  };
  documentId: string;
}
