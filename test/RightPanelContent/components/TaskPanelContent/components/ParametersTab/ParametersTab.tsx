import * as React from 'react';
import clsx from 'clsx';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { ParametersTabStyles } from './ParametersTab.styles';
import type { IParametersTab } from './ParametersTab.types';
import './ParametersTab.scss';
import { ViewTaskParameters } from './components/ViewTaskParameters';
import { PanelContentLayout } from '../../../../../layouts/PanelContent';
import { getTagsTask } from '../../../../../kanban/utils/tasksUtils';
import { getColorTask } from '../../../../utils/getColorTask';
import { useTaskPanelContext } from '../../../../../SkifTaskPanel/context2/useTaskPanelContext';
import { usePanelDataContext } from '../../../../../SkifTaskPanel/context2/usePanelDataContext';
import { isTaskStartEditDisabled } from '../../../../utils/isTaskStartModified';
import { EditTaskMembers } from './components/EditTaskMembers';
import { EditTaskDeadline } from './components/EditTaskDeadline';
import { EditTaskTags } from './components/EditTaskTags';

const useStyles = makeStyles(ParametersTabStyles);
const ParametersTab: React.FC<Partial<IParametersTab>> = ({ isEdit = false }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { task, errors, setMembers, setTimeframe, setError, setTags } = useTaskPanelContext();
  const { tags } = usePanelDataContext();
  const tagsStore = getTagsTask(task);
  const tagsContext = getTagsTask(task);

  const colorTask = theme.palette.mode === 'dark' ? '' : getColorTask(tagsStore);
  const colorTask10 = rgbaToHex(hexToRGBA(colorTask, 0.1));
  const startDisabled = isTaskStartEditDisabled(task);

  return (
    <PanelContentLayout
      className={clsx('ParametersTab', 'active', classes.root)}
      style={{ backgroundColor: colorTask10 }}
    >
      {isEdit ? (
        <>
          <EditTaskMembers
            className={clsx('Accordion', 'active')}
            members={task?.task.members || []}
            authorId={task?.task.author.user.id || ''}
            setMembers={setMembers}
            error={errors.executor}
            setError={setError}
            disabledObservers={Boolean(task?.parent)}
            color={colorTask}
          />
          <EditTaskDeadline
            className={clsx('Accordion', 'active')}
            timeframe={task?.task.timeframe}
            setTimeframe={setTimeframe}
            errors={errors}
            setError={setError}
            color={colorTask}
            startDisabled={startDisabled}
          />
          <EditTaskTags
            className={clsx('Accordion', 'active')}
            tags={tags}
            taskTags={tagsContext}
            setTags={setTags}
            color={colorTask}
          />
        </>
      ) : (
        <ViewTaskParameters className={clsx('Accordion', 'active')} task={task} color={colorTask} />
      )}
    </PanelContentLayout>
  );
};

export default ParametersTab;
