import clsx from 'clsx';
import * as React from 'react';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { TaskPanelStyles } from './TaskPanel.styles';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import './TaskPanel.scss';
import { getColorTask } from '../../utils/getColorTask';
import { TaskPanelContent } from '../TaskPanelContent';
import { useTaskPanelContext } from '../../../context/useTaskPanelContext';
import { usePanelTypeContext } from '../../../context/usePanelTypeContext';
import { getTagsTask } from '../../utils/getTagsTask';

const useStyles = makeStyles(TaskPanelStyles);

const TaskPanel: React.FC<{children:React.ReactNode}> = ({children}) => {
  const {task} = useTaskPanelContext()
  const theme = useTheme();
  const classes = useStyles(theme);
  const { isEdit, setEdit } = usePanelTypeContext();

  const currentTask = task;
  const tags = getTagsTask(currentTask);
  const [hideFooter, setHideFooter] = React.useState(false);
  let colorTask20 = rgbaToHex(hexToRGBA(getColorTask(tags), 0.2));

  if (theme.palette.mode === 'dark') colorTask20 = '';

  return (
    <div className={clsx('TaskPanel', classes.root)}>
      <Header
        name="Параметры задачи"
        className={clsx('active')}
        style={{ backgroundColor: colorTask20 }}
      />
      <TaskPanelContent isEdit={isEdit} setHideFooter={setHideFooter} task={task} />
      {!hideFooter && (
        <Footer isEdit={isEdit} setEdit={setEdit} style={{ backgroundColor: colorTask20 }} />
      )} 
    </div>
  );
};

export default TaskPanel;
