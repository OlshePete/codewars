import { ITaskTag } from '../../../../../../../../../../../../../types/tasksInterfaces';

export interface IListWithMore {
  search: string;
  tags: Record<string, ITaskTag>;
  filteredTaskTags: Record<string, ITaskTag>;
  selectTag: (key: string, checked: boolean | undefined) => void;
  handlerOpenCreateTag: () => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>, value: string | undefined) => void;
}
