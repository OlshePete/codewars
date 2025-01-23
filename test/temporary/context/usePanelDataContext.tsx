import * as React from 'react';
import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { useTaskPanelContext } from './useTaskPanelContext';
import { ITaskMessage, ITasksSettingsSchema } from '../types/automationInterfaces';
import { TabsNames } from '../types/panelInterfaces';
import { ITaskTag, TViewTask } from '../types/tasksInterfaces';
import { IModule, IUser } from '../types/esbInterfaces';
import { useSkifPanelContainer } from '../SkifPanelContainer/SkifPanelContainerContext';

export interface IPanelDataContext {
  selfId: string;
  userId: string;
  createPermission: boolean;
  subtasks: Record<string, Record<string, NonNullable<TViewTask>>>;
  history: Record<string, NonNullable<TViewTask>[]>;
  users: Record<string, IUser>;
  tags: Record<string, ITaskTag>;
  modules: Record<string, IModule>;
  userModules: Record<string, string>;
  taskSettings: ITasksSettingsSchema;
  tabsList:Array<TabsNames>;
  closePanel: () => void;
  updateTaskLocal: (task: NonNullable<TViewTask>) => void;
  addTag: (tag: ITaskTag) => void;
}

const PanelDataContext = createContext<IPanelDataContext | undefined>(undefined);

export interface IPanelDataProvider {
  children: ReactNode;
  taskSettings:ITasksSettingsSchema; 
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
  addTag: (tag: ITaskTag) => void;
  // setMessageLocal:(message:ITaskMessage)=>void;
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
  taskSettings,
  addTag,
  createPermission,
  tabsList,
  // setMessageLocal,
}) => {

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
      subtasks: storeSubtasks,
      users: storeUsers,
      history: storeHistory,
      tags: storeTags,
      modules: storeModules,
      userModules: storeUserModules,
      taskSettings: taskSettings,
      tabsList:tabsList,
      closePanel: closePanel,
      updateTaskLocal,
      // setMessageLocal,
      addTag,
    }),
    [
      userId,
      selfId,
      createPermission,
      tabsList,
      storeSubtasks,
      storeHistory,
      storeUsers,
      storeTags,
      storeModules,
      storeUserModules,
      taskSettings,
      closePanel,
      updateTaskLocal,
      // setMessageLocal,
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
