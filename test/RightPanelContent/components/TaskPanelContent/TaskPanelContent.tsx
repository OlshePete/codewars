import * as React from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { TaskPanelContentStyles } from './TaskPanelContent.styles';
import { ParametersTab } from './components/ParametersTab';
import { InformationTab } from './components/InformationTab';
import { HistoryTab } from './components/HistoryTab';
import type { ITaskPanelContent } from './TaskPanelContent.types';
import './TaskPanelContent.scss';
import { CommentsTab } from './components/CommentsTab';
import { getTagsTask } from '../../../kanban/utils/tasksUtils';
import { getColorTask } from '../../utils/getColorTask';
import { TabsNames } from './components/TabsPanel/TabsPanel.types';
import { TabsPanel } from './components/TabsPanel';

const useStyles = makeStyles(TaskPanelContentStyles);

const TaskPanelContent: React.FC<Partial<ITaskPanelContent>> = ({
  isEdit,
  setHideFooter,
  task,
}) => {
  const theme = useTheme();

  const currentTask = task ? task : null;
  const tags = getTagsTask(currentTask);
  let colorTask10 = rgbaToHex(hexToRGBA(getColorTask(tags), 0.1));

  if (theme.palette.mode === 'dark') colorTask10 = '';

  const [activeTab, setActiveTab] = useState<TabsNames>(TabsNames.Information);

  const onChangeTab = (value: TabsNames) => {
    setActiveTab(value);
  };

  useEffect(() => {
    setActiveTab(TabsNames.Information);
  }, [task?.task.id]);

  useEffect(() => {
    if (isEdit) setActiveTab(TabsNames.Parameters);
  }, [isEdit]);

  useEffect(() => {
    if (setHideFooter) {
      if (activeTab === TabsNames.Comments) {
        setHideFooter(true);
      } else {
        setHideFooter(false);
      }
    }
  }, [activeTab]);

  return (
    <>
      <TabsPanel
        activeTab={activeTab}
        onChange={onChangeTab}
        className={clsx('TaskPanelContent', 'active')}
        colorTask={colorTask10}
        disableComments={false}
      />
      {activeTab === TabsNames.Information && <InformationTab isEdit={isEdit} />}
      {activeTab === TabsNames.Parameters && <ParametersTab isEdit={isEdit} />}
      {activeTab === TabsNames.History && <HistoryTab />}
      {activeTab === TabsNames.Comments && <CommentsTab />}
    </>
  );
};

export default TaskPanelContent;
