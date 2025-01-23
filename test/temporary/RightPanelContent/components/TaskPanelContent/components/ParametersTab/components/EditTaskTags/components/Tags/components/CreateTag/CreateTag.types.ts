export interface ICreateTag {
  search: string;
  createTag: (name: string, color: string) => void;
  handlerCancelTagCreation: () => void;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>, value: string | undefined) => void;
}
