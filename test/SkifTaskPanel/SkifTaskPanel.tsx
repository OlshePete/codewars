import React, { FC } from 'react';
import { RightPanel } from '../layouts/RightPanel';
import { RightPanelContent } from '../RightPanelContent';
import { TaskPanelProvider } from './context2/useTaskPanelContext';
import { ITaskTag, TViewTask } from '../../../types/tasksInterfaces';
import { PanelProvider } from './context2/usePanelContext';
import { PanelDataProvider } from './context2/usePanelDataContext';
import { ITaskMessage } from '../../../types/automationInterfaces';

interface ISkifPanelProps {
  task: TViewTask;
  selfId: string;
  userId: string;
  createPermission: boolean;
  closePanel: () => void;
  updateTaskLocal: (task: NonNullable<TViewTask>) => void;
  setDeferMessage: (message: ITaskMessage) => void;
  addTag: (tag: ITaskTag) => void;
}
const SkifTaskPanel: FC<ISkifPanelProps> = ({
  task,
  selfId,
  userId,
  closePanel,
  updateTaskLocal,
  setDeferMessage,
  addTag,
  createPermission = true,
}) => {
  const showPanel = Boolean(task);
  return (
    <PanelDataProvider
      selfId={selfId}
      userId={userId}
      closePanelClb={closePanel}
      updateTaskLocal={updateTaskLocal}
      setDeferMessage={setDeferMessage}
      addTag={addTag}
      createPermission={createPermission}
    >
      <TaskPanelProvider initTask={task} userId={userId}>
        <PanelProvider>
          {showPanel && (
            <RightPanel>
              <RightPanelContent />
            </RightPanel>
          )}
        </PanelProvider>
      </TaskPanelProvider>
    </PanelDataProvider>
  );
};

export default SkifTaskPanel;
