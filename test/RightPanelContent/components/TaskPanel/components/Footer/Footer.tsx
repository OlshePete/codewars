import clsx from 'clsx';
import React, { useMemo } from 'react';
import { FooterStyles } from './Footer.styles';
import { UDSButton } from '@uds/react-components';
import type { IFooter } from './Footer.types';
import './Footer.scss';
import { isEqual } from 'lodash';
import { makeStyles, useTheme } from '@uds/utils';
import { useTaskPanelContext } from '../../../../../SkifTaskPanel/context2/useTaskPanelContext';
import {
  checkIsSubtasksDone,
  checkSelfAsAuthor,
  checkSelfAsCoExecutor,
  checkSelfAsExecutor,
  createAuthor,
  getMembersWithoutObserves,
  getObservers,
} from '../../../../../kanban/utils/usersUtils';
import { TViewTask, TasksStatus } from '../../../../../../../types/tasksInterfaces';
import { defineMembers } from '../../../../utils/defineMembers';
import { isProcessSubtask } from '../../../../../kanban/utils/tasksUtils';
import { getUpdateSubtask } from '../../../../utils/getUpdateSubtask';
import { getUpdateTask } from '../../../../utils/getUpdateTask';
import { getMembersList, updateConfMembers } from '../../../../../kanban/utils/conferenceUtils';
import { FooterLayout } from '../../../../../layouts/Footer';
import { TaskReportDialog } from '../TaskReportDialog';
import { usePanelDataContext } from '../../../../../SkifTaskPanel/context2/usePanelDataContext';
import { useSkifGlobal } from '@skif/utils';
import { Backend } from '../../../../../../../backendEmulator';

const useStyles = makeStyles(FooterStyles);
const Footer: React.FC<Partial<IFooter>> = ({ isEdit = false, className, setEdit, ...props }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const { task, baseTask, setTask, validate } = useTaskPanelContext();
  const {
    closePanel,
    setDeferMessage,
    subtasks: allSubtasks,
    conferences,
    users,
    modules,
    selfId,
    userId,
    createPermission,
  } = usePanelDataContext();
  const { backend } = useSkifGlobal<Backend>();
  const status = useMemo(() => task?.task?.state?.status, [task]);
  // const baseTask = task !== null ? (baseTasks[task.task.id] as typeof task) : null;
  const author = createAuthor(modules, selfId);
  // const userId = useAppSelector(selectUserId);

  const isSubtasksDone = checkIsSubtasksDone(allSubtasks[task?.task.id ?? '']);

  const isExecutor = useMemo(
    () => checkSelfAsExecutor(selfId, task, modules),
    [selfId, task, modules],
  );
  const isAuthor = useMemo(() => checkSelfAsAuthor(selfId, task, modules), [selfId, task, modules]);

  const isEditable = useMemo(() => {
    const isAuthor = checkSelfAsAuthor(selfId, task, modules);
    const isCoExecutor = checkSelfAsCoExecutor(selfId, task, modules);

    return isAuthor || isExecutor || isCoExecutor;
  }, [selfId, task, modules, isExecutor]);

  const editTask = (newStatus: TasksStatus, clearEndDate: boolean = false) => {
    if (!task) return;
    const begin = clearEndDate ? NaN : (task.task.state.begin ?? NaN);
    const newTask = {
      ...task,
      task: {
        ...task.task,
        state: {
          status: newStatus,
          begin,
        },
        editor: {
          ...task.task.editor,
          user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
        },
      },
    } as NonNullable<TViewTask>;
    backend && backend.automation.edit(newTask);
  };

  const onCLickSave = () => {
    if (validate()) {
      if (task && author) {
        const updateTaskMembers = defineMembers(
          getObservers(task.task.members),
          getMembersWithoutObserves(task.task.members),
          task.task.author.user.id,
        );
        const updateTask = {
          ...task,
          task: {
            ...task.task,
            editor: {
              ...author.author,
            },
            members: updateTaskMembers,
            state: {
              status: task.task.state.status,
            },
          },
        } as NonNullable<TViewTask>;
        updateTask.task.editor.user.id = userId || updateTask.task.editor.user.id;
        backend && backend.automation.edit(updateTask);

        if (allSubtasks) {
          const subtasks = allSubtasks[task?.task.id];
          Object.values(subtasks).forEach((value) => {
            const subtask = value;

            if (!isProcessSubtask(subtask)) {
              const updateSubtask = getUpdateSubtask(task, subtask);
              updateSubtask.task.editor.user.id = userId || updateSubtask.task.editor.user.id;
              updateSubtask.task.state = { status: updateSubtask.task.state.status };
              backend && backend.automation.edit(updateSubtask);

              const updateTask = getUpdateTask(task, subtask);
              updateTask.task.editor.user.id = userId || updateTask.task.editor.user.id;
              updateTask.task.state = { status: updateTask.task.state.status };
              backend && backend.automation.edit(updateTask);
            }
          });
        }

        if (conferences && conferences[task?.task.id]) {
          const currentConfMembers = conferences[task?.task.id].members;
          const newConfMembers = getMembersList(task, users, allSubtasks);

          if (newConfMembers && !isEqual(currentConfMembers, newConfMembers)) {
            console.log('\x1b[36m Список участников именился \x1b[0m', {
              currentConfMembers,
              newConfMembers,
            });
            updateConfMembers(backend, conferences[task?.task.id], newConfMembers);
          }
        }
      }

      if (setEdit && typeof setEdit === 'function') {
        setEdit(false);
      }
    }
  };
  const onClickRepeat = () => {
    if (!task) return;
    //TODO разобраться с кнопкой повтора задачи
    // const taskTemplate = getTaskToRepeat(task);

    // dispatch(setMessageWithMeta(null));
    // dispatch(setStateRightPanel(true));
    // dispatch(setCurrentTask(null));
    // // setType(PanelTypes.NewTask);
    // dispatch(setTasksToRepeat(taskTemplate));
  };
  const showRepeatButton =
    createPermission &&
    !isEdit &&
    (status === TasksStatus.Succeed ||
      status === TasksStatus.Archived ||
      status === TasksStatus.Failed);

  return (
    <FooterLayout className={clsx('active', className, classes.root)} {...props}>
      {task &&
        !isEdit &&
        isAuthor &&
        (status === TasksStatus.Succeed ||
          status === TasksStatus.Failed ||
          status === TasksStatus.Archived) && (
          <TaskReportDialog
            tasks={[task]}
            buttonClass={clsx(status !== TasksStatus.Archived && 'mr-16')}
            buttonLabel="Вернуть в работу"
            modalLabel="Возврат задачи в работу"
            onConfirm={(message) => {
              const hasMessage =
                message && (message.payload.value.length > 0 || message.payload.files.length > 0);

              if (userId) {
                hasMessage &&
                  setDeferMessage({
                    message,
                    attributes: {
                      sent: new Date().getTime(),
                    },
                    endpoint: {
                      user: userId,
                      conference: task?.task.id,
                    },
                  });
                editTask(TasksStatus.Running, true);
              }
            }}
            onReject={() => {
              console.log('rejected1');
            }}
          />
        )}
      {showRepeatButton && (
        <UDSButton
          variant="primary"
          className={clsx('mr-16')}
          // disabled={!isExecutor}
          onClick={onClickRepeat}
        >
          Повторить
        </UDSButton>
      )}
      {!isEdit && status === TasksStatus.Awaiting && (
        <UDSButton
          variant="primary"
          className={clsx('mr-16')}
          disabled={!isExecutor}
          onClick={() => {
            editTask(TasksStatus.Running);
          }}
        >
          Запустить
        </UDSButton>
      )}
      {task && !isEdit && status === TasksStatus.Running && (
        <TaskReportDialog
          tasks={[task]}
          buttonClass={'mr-16'}
          buttonLabel="Завершить"
          modalLabel="Завершение задачи"
          disabled={!isExecutor || !isSubtasksDone}
          onConfirm={(message) => {
            const hasMessage =
              message && (message.payload.value.length > 0 || message.payload.files.length > 0);

            if (userId) {
              hasMessage &&
                setDeferMessage({
                  message,
                  attributes: {
                    sent: new Date().getTime(),
                  },
                  endpoint: {
                    user: userId,
                    conference: task?.task.id,
                    module: [''],
                  },
                });
              editTask(TasksStatus.Succeed);
            }
          }}
          onReject={() => {
            console.log('rejected2');
          }}
        />
      )}
      {!isEdit &&
        isEditable &&
        (status === TasksStatus.Awaiting || status === TasksStatus.Running) && (
          <UDSButton
            onClick={() => {
              if (setEdit && typeof setEdit === 'function') {
                setEdit(true);
              }
            }}
          >
            Редактировать
          </UDSButton>
        )}
      {isEdit && (
        <>
          <UDSButton variant="primary" className={clsx('mr-16')} onClick={onCLickSave}>
            Сохранить
          </UDSButton>
          <UDSButton
            onClick={() => {
              if (baseTask) setTask(baseTask);

              if (setEdit && typeof setEdit === 'function') {
                setEdit(false);
              }
            }}
          >
            Отмена
          </UDSButton>
        </>
      )}
      {status === TasksStatus.Succeed && (
        <>
          <UDSButton
            variant="secondary"
            onClick={() => {
              editTask(TasksStatus.Archived);
              closePanel && closePanel();
            }}
          >
            В архив
          </UDSButton>
        </>
      )}
    </FooterLayout>
  );
};

export default Footer;
