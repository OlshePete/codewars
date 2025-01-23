export interface IFooter extends React.HTMLProps<HTMLDivElement> {
  isEdit: boolean;
  setEdit: (value: boolean) => void;
}
