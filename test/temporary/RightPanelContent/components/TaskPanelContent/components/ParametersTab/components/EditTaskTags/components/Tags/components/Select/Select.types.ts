import { ITaskTag } from "../../../../../../../../../../../types/tasksInterfaces";

export interface ISelect {
  openSelect: (e: React.FormEvent<HTMLElement>) => void;
  taskTags: Record<string, ITaskTag>;
  handleRemoveChip: (e: React.SyntheticEvent<HTMLElement, Event>, id: string) => void;
  handlerShowMore: (e: React.FormEvent<HTMLElement>) => void;
}
