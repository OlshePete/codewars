import clsx from 'clsx';
import * as React from 'react';
import { useMemo } from 'react';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { HistoryTabStyles } from './HistoryTab.styles';
import { TClick } from '../../../../../../../types/tasksInterfaces';
import { PanelContentLayout } from '../../../../../layouts/PanelContent';
import { getColorTask } from '../../../../utils/getColorTask';
import { getFocusDesctination, getTagsTask } from '../../../../../kanban/utils/tasksUtils';
import { historyParser } from '../../../../../kanban/utils/history/utils';
import { ViewHistory } from './components/ViewHistory';
import { usePanelDataContext } from '../../../../../SkifTaskPanel/context2/usePanelDataContext';
import { useTaskPanelContext } from '../../../../../SkifTaskPanel/context2/useTaskPanelContext';

const useStyles = makeStyles(HistoryTabStyles);
const HistoryTab: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const { task } = useTaskPanelContext();
  const { users, subtasks: allSubtasks, history } = usePanelDataContext();

  const currentTask = task;
  const tags = getTagsTask(currentTask);
  const colorTask = theme.palette.mode === 'dark' ? '' : getColorTask(tags);
  const colorTask10 = rgbaToHex(hexToRGBA(colorTask, 0.1));

  const onClickItem = ({ subtaskId, subtaskType }: TClick) => {
    const destinationModule = getFocusDesctination(subtaskType);
    const info = {
      automation: {
        task: {
          id: subtaskId,
        },
      },
    };

    if (destinationModule) {
      window.skifWebFrontend.backend.form.modifier.focus(destinationModule, info);
    } else {
      console.log('метод для перефокусировки не найден');
    }
  };

  const taskHistory = useMemo(
    () => historyParser({ task: currentTask, history, users, allSubtasks }),
    [currentTask, history, users, allSubtasks],
  );

  return (
    <PanelContentLayout
      className={clsx('HistoryTab', classes.root)}
      style={{ backgroundColor: colorTask10 }}
    >
      <ViewHistory history={taskHistory} colorTask={colorTask} onClickItem={onClickItem} />
    </PanelContentLayout>
  );
};

export default HistoryTab;
