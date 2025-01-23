import { TSchemasFindValue } from '@skif/utils';
import { TPayloadMessage } from '../../../../../../../types/tasksInterfaces';

export interface IDocumentViewer {
  dataForView: TSchemasFindValue | null;
  payload?: Record<string, TPayloadMessage> | null;
  flags?: Array<string>;
  setViewer?: (viewer: Record<any, any>) => void; // TODO Временно для валидации данных документа
  documentId?: string;
}
