import { IFile } from '@skif/utils';
import type { ClassValue } from 'clsx';

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
