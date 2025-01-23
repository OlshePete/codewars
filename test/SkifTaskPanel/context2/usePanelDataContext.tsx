import * as React from 'react';
import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useAppSelector } from '../../../../redux/hook';
import { TTaskList } from '../../../../redux/slices/tasksSlice';
import {
  ITaskConference,
  ITaskMessage,
  ITasksSettingsSchema,
} from '../../../../types/automationInterfaces';
import { ITaskTag, TViewTask } from '../../../../types/tasksInterfaces';
import { IModule, IUser } from '../../../../types/esbInterfaces';
import { useTaskPanelContext } from './useTaskPanelContext';
import { useSkifPanelContainer } from '../../kanban/temporary/SkifPanelContainer/SkifPanelContainerContext';
import { TabsNames } from '../../RightPanelContent/components/TaskPanelContent/components/TabsPanel/TabsPanel.types';

export interface IPanelDataContext {
  selfId: string;
  userId: string;
  createPermission: boolean;
  // tasks: TTaskList;
  subtasks: Record<string, Record<string, NonNullable<TViewTask>>>;
  history: Record<string, NonNullable<TViewTask>[]>;
  conferences: Record<string, ITaskConference>;
  messagesAll: Record<string, Record<string, ITaskMessage>>;
  messagesDefer: Record<string, Record<string, ITaskMessage>>;
  users: Record<string, IUser>;
  tags: Record<string, ITaskTag>;
  modules: Record<string, IModule>;
  userModules: Record<string, string>;
  taskSettings: ITasksSettingsSchema;
  tabsList:Array<TabsNames>;
  closePanel: () => void;
  updateTaskLocal: (task: NonNullable<TViewTask>) => void;
  setDeferMessage: (message: ITaskMessage) => void;
  addTag: (tag: ITaskTag) => void;
}

const PanelDataContext = createContext<IPanelDataContext | undefined>(undefined);

export interface IPanelDataProvider {
  children: ReactNode;
  selfId: string;
  userId: string;
  createPermission: boolean;
  tabsList:Array<TabsNames>;
  subtasks: Record<string, Record<string, NonNullable<TViewTask>>>;
  history: Record<string, NonNullable<TViewTask>[]>;
  tags: Record<string, ITaskTag>;
  users:Record<string, IUser>;
  modules:Record<string, IModule>;
  userModules:Record<string, string>;
  // closePanelClb: () => void;
  // updateTaskLocal: (task: NonNullable<TViewTask>) => void;
  setDeferMessage: (message: ITaskMessage) => void;
  addTag: (tag: ITaskTag) => void;
  addConference:(props: any) => void;
  sendMessage:() => void;
}

const PanelDataProvider: FC<IPanelDataProvider> = ({
  children,
  selfId,
  userId,
  subtasks:storeSubtasks,
  history:storeHistory,
  tags:storeTags,
  users:storeUsers,
  userModules:storeUserModules,
  modules:storeModules,
  // closePanelClb,
  // updateTaskLocal,
  setDeferMessage,
  addTag,
  createPermission,
  tabsList,
  addConference,
  sendMessage
}) => {

  const storeConferences = useAppSelector((state) => state.commentsSlice.conferences);
  const storeMessagesAll = useAppSelector((state) => state.commentsSlice.messages);
  const storeMessagesDefer = useAppSelector((state) => state.commentsSlice.deferMessages);

  const storeTaskSettings = useAppSelector((state) => state.automationSlice.settings);

  const { setTask: updateTaskLocal } = useTaskPanelContext();

  const { onToggle } = useSkifPanelContainer();
  const closePanel = () => {
    onToggle && typeof onToggle === 'function' && onToggle(false);
  };
  const value = useMemo(
    () => ({
      selfId: selfId,
      userId: userId,
      createPermission,
      // tasks: storeTasks,
      subtasks: storeSubtasks,
      users: storeUsers,
      history: storeHistory,
      conferences: storeConferences,
      messagesAll: storeMessagesAll,
      messagesDefer: storeMessagesDefer,
      tags: storeTags,
      modules: storeModules,
      userModules: storeUserModules,
      taskSettings: storeTaskSettings,
      tabsList:tabsList,
      closePanel: closePanel,
      updateTaskLocal,
      setDeferMessage,
      addTag,
    }),
    [
      userId,
      selfId,
      createPermission,
      tabsList,
      // storeTasks,
      storeSubtasks,
      storeConferences,
      storeMessagesAll,
      storeMessagesDefer,
      storeHistory,
      storeUsers,
      storeTags,
      storeModules,
      storeUserModules,
      storeTaskSettings,
      closePanel,
      updateTaskLocal,
      setDeferMessage,
      addTag,
    ],
  );

  return <PanelDataContext.Provider value={value}>{children}</PanelDataContext.Provider>;
};

const usePanelDataContext = () => {
  const context = useContext(PanelDataContext);

  if (context === undefined) {
    throw new Error('usePanelDataType must be used within a PanelDataProvider');
  }

  return context;
};

export { PanelDataProvider, usePanelDataContext };
