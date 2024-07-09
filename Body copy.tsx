import clsx from 'clsx';
import * as React from 'react';
import type { FC } from 'react';

import { BodyStyles } from './Body.styles';
import { useClasses } from '../../../../../../hooks';

import { Task } from '../Task';

import { TasksStatus } from '../../../../../../../types/tasksInterfaces';
import type { IBaseTask, ITaskDiscus } from '../../../../../../../types/tasksInterfaces';
import type { IBodyProps } from './Body.types';

const Body: FC<IBodyProps> = ({ filteredAndSortTasks, nowDate, onSelectTask }) => {
  const classes = useClasses(BodyStyles);
  const [tasksMap, setTasksMap] = React.useState<Map<string, IBaseTask<ITaskDiscus>>>(new Map());

  React.useEffect(() => {
    console.log('useeffect filteredAndSortTasks', filteredAndSortTasks);
    
    const sliceArchived = filteredAndSortTasks.reduce<
      [IBaseTask<ITaskDiscus>[], IBaseTask<ITaskDiscus>[]]
    >(
      (acc, prev) => {
        if (prev.task.state.status === TasksStatus.Archived) {
          acc[1].unshift(prev);
        } else {
          acc[0].unshift(prev);
        }
        return acc;
      },
      [[], []],
    );

    console.log('sliceArchived:', sliceArchived);
    const archivedSortTasks = [...sliceArchived[0],...sliceArchived[1]];
    console.log('archivedSortTasks:', archivedSortTasks);

    archivedSortTasks.forEach((task) => {
      tasksMap.set(task.task.id, task);
    });

    setTasksMap(new Map(tasksMap));
  }, [filteredAndSortTasks]);

  const renderTasks = () => {
    const tasksToRender = Array.from(tasksMap.values());
    console.log('#1 renderTasks called', tasksToRender); 
    const batch_size = undefined;
    const tasksToRenderBatch = tasksToRender.splice(0);
    console.log('#2 renderTasks called', tasksToRenderBatch); 

    return (
      <tbody className={clsx(classes.root)}>
        {tasksToRenderBatch.map((task) => (
          <Task key={task.task.id} task={task} nowDate={nowDate} onSelectTask={onSelectTask} />
        ))}
      </tbody>
    );
  };

  return renderTasks();
};
export default Body;