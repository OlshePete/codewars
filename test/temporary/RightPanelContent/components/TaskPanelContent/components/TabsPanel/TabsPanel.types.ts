
export interface ITabsPanel {
  activeTab: TabsNames;
  onChange: (value: TabsNames) => void;
  className?: string | null;
  colorTask?: string;
  hideHistory?: boolean;
  disableComments?: boolean;
}
