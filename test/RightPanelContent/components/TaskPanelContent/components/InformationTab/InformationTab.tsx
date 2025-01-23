import React from 'react';
import clsx from 'clsx';
import { UDSHeader } from '@uds/react-components';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { InformationTabStyles } from './InformationTab.styles';
import type { IInformationTab } from './InformationTab.types';
import './InformationTab.scss';
import { IFile } from '@skif/utils';
import { getTagsTask } from '../../../../../kanban/utils/tasksUtils';
import { getColorTask } from '../../../../utils/getColorTask';
import { PanelContentLayout } from '../../../../../layouts/PanelContent';
import { ViewTaskDescription } from './components/ViewTaskDescription';
import { ViewTaskFiles } from './components/ViewTaskFiles';
import { useTaskPanelContext } from '../../../../../SkifTaskPanel/context2/useTaskPanelContext';
import { usePanelDataContext } from '../../../../../SkifTaskPanel/context2/usePanelDataContext';
import { isBaseTaskDiscus } from '../../../../utils/isBaseTaskDiscus';

const useStyles = makeStyles(InformationTabStyles);
const InformationTab: React.FC<Partial<IInformationTab>> = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { task, setTask:updateTaskLocal } = useTaskPanelContext();
  // const { updateTaskLocal } = usePanelDataContext();
  const withDiscus = isBaseTaskDiscus(task);
  const currentTask = task;
  const tags = getTagsTask(currentTask);
  const colorTask = theme.palette.mode === 'dark' ? '' : getColorTask(tags);
  const colorTask10 = rgbaToHex(hexToRGBA(colorTask, 0.1));
  const isDescriptionBlank = withDiscus
    ? Boolean(task?.task.discus.description.type !== 'skif.text')
    : false;

  const updateFiles = (files: IFile[]) => {
    const updatedFiles = files;
    if (!withDiscus) return;
    // TODO - обновление файло для подзадач
    // if (task?.parent) {
    //   const updatedSubtask = {
    //     ...task,
    //     task: {
    //       ...task?.task,
    //       discus: {
    //         ...task?.task.discus,
    //         description: {
    //           ...task?.task.discus.description,
    //           payload: {
    //             ...task?.task.discus.description.payload,
    //             files: updatedFiles,
    //           },
    //         },
    //       },
    //     },
    //   };
    //   dispatch(updateSubTask(updatedSubtask));
    // } else {
    const updatedTask = {
      ...task,
      task: {
        ...task?.task,
        discus: {
          ...task?.task.discus,
          description: {
            ...task?.task.discus.description,
            payload: {
              ...task?.task.discus.description.payload,
              files: updatedFiles,
            },
          },
        },
      },
    };
    updateTaskLocal(updatedTask);
    // }
  };

  return (
    <PanelContentLayout
      className={clsx('InformationTab', 'TaskDiscusData', 'active', classes.root)}
      style={{ backgroundColor: colorTask10 }}
    >
      <UDSHeader
        className={clsx('name', 'active')}
        type="h4"
        style={{ backgroundColor: colorTask10 }}
      >
        {task?.task.name}
      </UDSHeader>
      {withDiscus && (
        <ViewTaskDescription
          color={colorTask}
          className={clsx('Accordion', 'active')}
          content={task?.task.discus?.description?.payload?.value || ''}
          description={task?.task.discus.description}
          isDescriptionBlank={isDescriptionBlank}
          documentId="document-viewer-right-panel"
        />
      )}

      {!isDescriptionBlank && withDiscus && (
        <ViewTaskFiles
          color={colorTask}
          className={clsx('Accordion', 'active')}
          files={task?.task.discus?.description?.payload?.files || []}
          updateFiles={updateFiles}
        />
      )}
    </PanelContentLayout>
  );
};

export default InformationTab;
