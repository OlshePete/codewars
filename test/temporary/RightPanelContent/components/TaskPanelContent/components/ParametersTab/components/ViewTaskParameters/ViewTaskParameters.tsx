import * as React from 'react';
import { useMemo } from 'react';
import clsx from 'clsx';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { UDSAccordion, UDSAccordionContent, UDSAccordionHeader } from '@uds/react-components';
import type { IViewParameters } from './ViewTaskParameters.types';
import './ViewTaskParameters.scss';
import { ViewTaskParametersStyles } from './ViewTaskParameters.styles';
import { getTaskBeginDate } from '../../../../../../utils/getTaskBeginDate';
import { getTaskEndDate } from '../../../../../../utils/getTaskEndDate';
import createTextExecutors from '../../../../../../utils/createTextExecutors';
import createTextCoExecutors from '../../../../../../utils/createTextCoExecutors';
import createTextObservers from '../../../../../../utils/createTextObservers';
import { ParameterTable } from '../parameterTable';
import ParameterTableRow from '../parameterTableRow/parameterTableRow';
import { TasksStatus } from '../../../../../../../types/tasksInterfaces';
import { getTagsTask } from '../../../../../../utils/getTagsTask';
import { getUserFullName } from '../../../../../../utils/getUserFullName';
import { getTaskAuthorId } from '../../../../../../../../utils/usersUtils';
import { convertToLocalDate } from '../../../../../../utils/converters';
import { TASK_STATUS } from '../../../../../../../const';
import { usePanelDataContext } from '../../../../../../../context/usePanelDataContext';

const useStyles = makeStyles(ViewTaskParametersStyles);

const ViewTaskParameters: React.FC<IViewParameters> = ({
  task,
  className,
  color,
  isOpen = true,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const { users, history} = usePanelDataContext()
  const taskHistory = task ? history[task.task.id] : undefined;

  const begin = useMemo(() => getTaskBeginDate(task, taskHistory), [task, taskHistory]);
  const end = useMemo(() => getTaskEndDate(task, taskHistory), [task, taskHistory]);
  const deadline = useMemo(() => task?.task.timeframe.end, [task]);
  const status = useMemo<TasksStatus | undefined>(() => task?.task.state.status, [task]);
  const tags = useMemo(() => getTagsTask(task), [task]);
  const [executorName, executorValue] = useMemo(
    () => createTextExecutors(task?.task.members || [], users),
    [task],
  );
  const [coExecutorName, coExecutorValue] = useMemo(
    () => createTextCoExecutors(task?.task.members || [], users),
    [task],
  );
  const [observersName, observersValue] = useMemo(
    () => createTextObservers(task?.task.members || [], users),
    [task],
  );
  const colorTask10 = rgbaToHex(hexToRGBA(color ?? '', 0.1));
  const colorTask20 = rgbaToHex(hexToRGBA(color ?? '', 0.2));

  return (
    <UDSAccordion
      isOpen={isOpen}
      className={clsx('ViewTaskParameters', 'br-none', className, classes.root)}
    >
      <UDSAccordionHeader label="Сведения" style={{ backgroundColor: colorTask20 }} />
      <UDSAccordionContent style={{ backgroundColor: colorTask10 }}>
        <ParameterTable>
          <ParameterTableRow
            name="Автор"
            value={getUserFullName(users[getTaskAuthorId(task) || ''])}
          />
          <ParameterTableRow name={executorName} value={executorValue} />
          <ParameterTableRow name={coExecutorName} value={coExecutorValue} />
          <ParameterTableRow name={observersName} value={observersValue} />
          <ParameterTableRow name="Дата начала" value={begin ? convertToLocalDate(begin) : ''} />
          <ParameterTableRow name="Дата окончания" value={end ? convertToLocalDate(end) : ''} />
          <ParameterTableRow
            name="Крайний срок"
            value={deadline ? convertToLocalDate(deadline) : ''}
          />
          <ParameterTableRow
            name="Теги"
            value={
              tags
                ? Object.values(tags)
                    .map((tag) => tag.name)
                    .join(', ')
                : ''
            }
          />
          <ParameterTableRow name="Статус" value={TASK_STATUS[status || TasksStatus.Awaiting]} />
        </ParameterTable>
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default ViewTaskParameters;
