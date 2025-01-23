import React, { FC } from 'react';
import styles from './RightPanelContent.module.scss';
import clsx from 'clsx';
import { UDSScroll } from '@uds/react-components';
import { TaskPanel } from './components/TaskPanel';
import { makeStyles } from '@uds/utils';
import { RightPanelContentStyles } from './RightPanelContent.styles';
import { ITaskPanelContentProps } from './RightPanelContent.types';
import { TaskPanelProvider } from '../context/useTaskPanelContext';
import { PanelDataProvider } from '../context/usePanelDataContext';
import { PanelCommentsProvider } from '../context/usePanelCommentsContext';
import { PanelTypeProvider } from '../context/usePanelTypeContext';

const useStyles = makeStyles(RightPanelContentStyles);

const RightPanelContent: FC<ITaskPanelContentProps> = ({
  task,
  taskSettings,
  userId,
  selfId,
  setMessageLocal,
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
  addConference = window.skifWebFrontend.backend.automation.comments.add,
  sendMessage = window.skifWebFrontend.backend.automation.comments.send,
  loadConference = window.skifWebFrontend.backend.automation.comments.load,
}) => {
  return (
    <div className={clsx(styles.container)}>
      {task ? (
        <PanelTypeProvider>
          <TaskPanelProvider initTask={task} userId={userId}>
            <PanelDataProvider
              selfId={selfId}
              userId={userId}
              addTag={addTag}
              createPermission={createPermission}
              tabsList={tabsList}
              subtasks={subtasks}
              history={history}
              tags={tags}
              users={users}
              userModules={userModules}
              modules={modules}
              taskSettings={taskSettings}
            >
              <PanelCommentsProvider
                addConference={addConference}
                loadConference={loadConference}
                sendMessage={sendMessage}
                conferences={conferences}
                messagesAll={messagesAll}
                setMessageLocal={setMessageLocal}
              >
                <TaskPanel />
              </PanelCommentsProvider>
            </PanelDataProvider>
          </TaskPanelProvider>
        </PanelTypeProvider>
      ) : (
        <h1>Задача не найдена</h1>
      )}
      <UDSScroll />
    </div>
  );
};

export default RightPanelContent;
