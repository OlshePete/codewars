export enum TabsNames {
  Parameters = 'parameters',
  Information = 'information',
  History = 'history',
  Comments = 'comments',
}

export interface ITabsPanel {
  activeTab: TabsNames;
  onChange: (value: TabsNames) => void;
  className?: string | null;
  colorTask?: string;
  hideHistory?: boolean;
  disableComments?: boolean;
}
