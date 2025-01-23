import { ITaskTag, TViewTask } from '../types/tasksInterfaces';
import { ITaskConference, ITaskMessage, ITasksSettingsSchema } from '../types/automationInterfaces';
import { TabsNames } from '../types/panelInterfaces';
import { IModule, IUser } from '../types/esbInterfaces';

export interface ITaskPanelContentProps {
  task: TViewTask;
  selfId: string;
  userId: string;
  createPermission: boolean;
  taskSettings: ITasksSettingsSchema;
  setMessageLocal: (message: ITaskMessage) => void;
  addTag: (tag: ITaskTag) => void;
  tabsList: Array<TabsNames>;
  subtasks: Record<string, Record<string, NonNullable<TViewTask>>>;
  history: Record<string, NonNullable<TViewTask>[]>;
  tags: Record<string, ITaskTag>;
  users:Record<string, IUser>;
  modules:Record<string, IModule>;
  userModules:Record<string, string>;
  conferences: Record<string, ITaskConference>;
  messagesAll: Record<string, Record<string, ITaskMessage>>;
  addConference?:(props: any) => void;
  sendMessage?:() => void;
  loadConference?: (props: any, count: number) => void
}
