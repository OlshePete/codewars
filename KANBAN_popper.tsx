import React, { useEffect, useState } from 'react';
import {
  IBaseTask,
  ITaskDiscus,
  TasksStatus,
  TypesTask,
} from '../../../../../types/tasksInterfaces';
import styles from './TaskWrapper.module.scss';
import { MembersBox } from './components/MembersBox';
import { DeadlinesBox } from './components/DeadlinesBox';
import { ButtonGroup } from './components/ButtonGroup';
import { useAppSelector } from '../../../../../redux/hook';
import { selectSubTasksByID } from '../../../../../redux/selectors/tasksSelectors';
import { getFocusDesctination } from '../../utils/tasksUtils';
import { usePopperMenuContext } from '../../../../context/usePopperMenuContext';
import { ClickAwayListener, UDSButton, UDSListItem, UDSMenu, useClientRect } from '@uds/react-components';
import { Close } from '@uds/icons/12px'
type TTaskWrapper = React.FC<{
  task: IBaseTask<ITaskDiscus>;
  group_type: TasksStatus;
  isDragging?: boolean;
  isDragDisabled?: boolean;
}>;

const TaskWrapper: TTaskWrapper = ({
  task,
  group_type,
  isDragging = false,
  isDragDisabled = false,
}) => {
  const { id, members, discus } = task.task;
  const attachments = discus.description.payload.files;
  const comments: any[] = []; // TODO
  const subtask_list = useAppSelector(selectSubTasksByID(id));
  const subcount = Object.keys(subtask_list).length;
  const { openPopper, openPopperHandler, closePopperHandler } = usePopperMenuContext();
  const [rect, ref, updateRect] = useClientRect<HTMLDivElement>();
  // const [isOpen, setIsOpen] = useState(openPopper === id)
  const isOpen = openPopper === id;
  const handleClickTask: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (!isOpen) {
      openPopperHandler(id);
      console.log('один клик - открываем попап');
    } else {
      closePopperHandler();
      console.log('один клик - закрываем попап');
    }
  };
  const handleDoubleClickTask: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const info = {
      automation: {
        task: {
          id: task.task.id,
        },
      },
    };
    const destinationModule = getFocusDesctination(task.task.type);
    if (task.task.type === TypesTask.Discus) {
      // @ts-ignore
      if (   window.skifWebFrontend.backend?.form?.modifier?.focus &&   typeof window.skifWebFrontend.backend.form.modifier.focus === 'function' ) {
        console.log(
          `\x1b[36m Перенаправляем фокус на  \x1b[0m`,
          `: `,
          'task-list',
          JSON.stringify(destinationModule),
          JSON.stringify(info),
        );
        // @ts-ignore
        window.skifWebFrontend.backend.form.modifier.focus(destinationModule, info);
      } else {
        console.log('метод для перефокусировки не найден');
        console.dir(window.skifWebFrontend.backend);
      }
    }
  };
  // useEffect(() => {
  //   if ( openPopper === id && !isOpen) setIsOpen(true); else setIsOpen(false)
  // }, [openPopper])

  useEffect(() => {
    console.log(rect);
  }, [rect]);

  return (
    <>
      <div
        className={`${styles.container} ${isOpen ? styles.active : ''}`}
        style={{
          opacity: isDragging ? 0.6 : 1,
          cursor: !isDragDisabled ? 'pointer' : 'default',
        }}
        onClick={handleClickTask}
        onDoubleClick={handleDoubleClickTask}
        ref={ref}
      >
        <div className={styles.header}>
          <h4 className={styles.title}>{task.task.name}</h4>
          {subcount && subcount > 0 && <span className={styles.notification}>{subcount}</span>}
        </div>
        <DeadlinesBox timeframe={task.task.timeframe} group_type={group_type} />
        <div className={styles.bottomGroup}>
          <MembersBox members={members} />
          <ButtonGroup attachments={attachments} comments={comments} />
        </div>
      </div>
      {isOpen && (
        <ClickAwayListener
          onClickAway={(e) => {
            closePopperHandler();
          }}
        >
          <UDSMenu
             className={styles.taskMenu}//"TaskViewerList_Menu"//
            coordinates={{ top: (rect?.bottom ?? 0) + 8, left: rect?.left }}
            size="medium"
            withCorner={true}
            cornerPosition={'topleft'}
            
            style={{
              width: rect?.width ?? '300px',
              background: 'white',
            }}
          >
            <UDSButton startIcon={<Close/>} className='closePopperButton' onClick={closePopperHandler}/>
            
                <h4 className={styles.title}>{task.task.name}</h4>
              <UDSListItem value={id+1}> блок 1 </UDSListItem>
              <UDSListItem value={id+2}> блок 2 </UDSListItem>
              <UDSListItem value={id+3}> блок 3 </UDSListItem>
            {/* </div> */}
          </UDSMenu>
        </ClickAwayListener>
      )}
    </>
  );
};

export default TaskWrapper;
