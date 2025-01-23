import { ITaskTag } from '../../../../../../../../../../../types/tasksInterfaces';

export interface ITags {
  tags: Record<string, ITaskTag>;
  taskTags: Record<string, ITaskTag>;
  setTags: (tags: Record<string, ITaskTag>) => void;
}

export enum DropDownChildren {
  List = 'List',
  ListWithMore = 'ListWithMore',
  CreateTag = 'CreateTag',
}
