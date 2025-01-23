import React, { FC } from 'react';
import styles from './RightPanelContent.module.scss';
import clsx from 'clsx';
import { UDSScroll } from '@uds/react-components';
import { TaskPanel } from './components/TaskPanel';
import {
  TaskPanelProvider,
} from '../SkifTaskPanel/context2/useTaskPanelContext';
import { ITaskTag, TViewTask } from '../../../types/tasksInterfaces';
import { PanelProvider } from '../SkifTaskPanel/context2/usePanelContext';
import { ITaskConference, ITaskMessage, ITasksSettingsSchema } from '../../../types/automationInterfaces';
import { TabsNames } from './components/TaskPanelContent/components/TabsPanel/TabsPanel.types';
import { IModule, IUser } from '../../../types/esbInterfaces';
import { PanelCommentsProvider } from '../SkifTaskPanel/context2/usePanelCommentsContext';
import { makeStyles } from '@uds/utils';
import { RightPanelContentStyles } from './RightPanelContent.styles';
import { PanelDataProvider } from '../kanban/temporary/context/usePanelDataContext';
const useStyles = makeStyles(RightPanelContentStyles);
//________________________________________________________________________old
interface ITaskPanelContentProps {
  task: TViewTask;
  selfId: string;
  userId: string;
  createPermission: boolean;
  // setDeferMessage: (message: ITaskMessage) => void;
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
  taskSettings: ITasksSettingsSchema;
  setMessageLocal: (message: ITaskMessage) => void;
  addConference?:(props: any) => void;
  sendMessage?:() => void;
  loadConference?: (props: any, count: number) => void
}
const RightPanelContent: FC<ITaskPanelContentProps> = ({
  task,
  userId,
  selfId,
  addTag,
  createPermission,
  tabsList,
  subtasks,
  tags,
  history,
  users,
  userModules,
  modules,
  conferences,
  messagesAll,
  taskSettings,
  setMessageLocal,
  addConference = window.skifWebFrontend.backend.automation.comments.add,
  sendMessage = window.skifWebFrontend.backend.automation.comments.send,
  loadConference = window.skifWebFrontend.backend.automation.comments.load
}) => {
  return (
    <div className={clsx(styles.container)}>
      {task ? (
        <TaskPanelProvider initTask={task} userId={userId}>
          <PanelDataProvider
            setMessageLocal={setMessageLocal}
            selfId={selfId}
            userId={userId}
            taskSettings={taskSettings}
            addTag={addTag}
            createPermission={createPermission}
            tabsList={tabsList}
            subtasks={subtasks}
            history={history}
            tags={tags}
            users={users}
            userModules={userModules}
            modules={modules}
          >
            <PanelProvider>
              <PanelCommentsProvider
                addConference={addConference}
                loadConference={loadConference}
                sendMessage={sendMessage}
                setMessageLocal={setMessageLocal}
                conferences={conferences}
                messagesAll={messagesAll}
              >
                <TaskPanel />
              </PanelCommentsProvider>
            </PanelProvider>
          </PanelDataProvider>
        </TaskPanelProvider>
      ) : (
        <h1>Задача не найдена</h1>
      )}
      <UDSScroll />
    </div>
  );
};

export default RightPanelContent;
