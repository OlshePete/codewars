import clsx from 'clsx';
import * as React from 'react';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { CommentsTabStyles } from './CommentsTab.styles';
import { TaskConference } from './components/TaskConference';
import { useTaskPanelContext } from '../../../../../context/useTaskPanelContext';
import { getTagsTask } from '../../../../../../utils/tasksUtils';
import { getColorTask } from '../../../../utils/getColorTask';
import { PanelContentLayout } from '../../../../../layout/PanelContent';

const useStyles = makeStyles(CommentsTabStyles);
const CommentsTab: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { task } = useTaskPanelContext();

  const currentTask = task;
  const tags = getTagsTask(currentTask);
  const colorTask = theme.palette.mode === 'dark' ? '' : getColorTask(tags);
  const colorTask10 = rgbaToHex(hexToRGBA(colorTask, 0.1));

  return (
    <PanelContentLayout
      className={clsx('CommentsTab', classes.root)}
      style={{ backgroundColor: colorTask10 }}
    >
      <TaskConference />
    </PanelContentLayout>
  );
};

export default CommentsTab;
