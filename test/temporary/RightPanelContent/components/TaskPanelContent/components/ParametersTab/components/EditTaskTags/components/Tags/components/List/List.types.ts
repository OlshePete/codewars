import { ITaskTag } from "../../../../../../../../../../../types/tasksInterfaces";

export interface IList {
  search: string;
  tags: Record<string, ITaskTag>;
  taskTags: Record<string, ITaskTag>;
  filteredTags: Record<string, ITaskTag>;
  selectTag: (key: string, checked: boolean | undefined) => void;
  handlerOpenCreateTag: () => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>, value: string | undefined) => void;
}
