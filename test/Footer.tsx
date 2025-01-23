import clsx from 'clsx';
import * as React from 'react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditTasks } from '../../../../../../redux/actions/tasks';
import { modulesSelector, selfIdSelector, userIdSelector } from '../../../../../../redux/selectors/esbSelectors';
import { subtaskSelector, subtasksSelector, taskSelector } from '../../../../../../redux/selectors/tasksSelectors';
import { FooterStyles } from './Footer.styles';
import { UDSButton } from '@uds/react-components';
import { FooterLayout } from '../../../../../layouts/Footer';
import { useTaskDiscusContext } from '../../../../../contexts/useTaskDiscusContext';
import { checkSelfAsAuthor, checkSelfAsCoExecutor, checkSelfAsExecutor } from '../../../../../utils';
import { getUpdateTask } from '../../../../utils/getUpdateTask';
import { getUpdateSubtask } from '../../../../utils/getUpdateSubtask';
import { TasksStatus } from '../../../../../../types/tasksInterfaces';
import type { ITaskDiscus, IBaseTask, TSubtasks, ITaskMember } from '../../../../../../types/tasksInterfaces';
import type { IFooter } from './Footer.types';
import { setStateRightPanel } from '../../../../../../redux/actions/app';
import { usePanelContext } from '../../../../../pages/SubtasksPage/contexts/usePanelContext';
import { useSubtaskTypeContext } from '../../../../../pages/SubtasksPage/contexts/useSubtaskType';
import { PanelTypes } from '../../../../SubtaskPageContent/consts';
import { useSubtaskTemplateContext } from '../../../../../pages/SubtasksPage/contexts/useSubtaskTemplate';
import { getTaskToRepeat } from '../../../../../utils/taskUtils';
import { makeStyles, useTheme } from '@uds/utils';
import { useAppSelector } from '@redux/store';
import { IProcessSubtaskBase } from '@apptypes/processInterfaces ';
import { getMembersList } from '@client/utils/conferenceUtils';
import { MemberRights } from '@consts';
import { getMembersWithoutObserves, getObservers } from '@client/utils/usersUtils';

const isMemberWasExcluded = (task:IBaseTask<ITaskDiscus>, newSubtask:IBaseTask<ITaskDiscus>, baseSubtask:TSubtasks | IProcessSubtaskBase,subtasks:TSubtasks[] ):(string | null) => {
  if ('members' in baseSubtask.task) {
    const subtaskId = newSubtask.task.id
    const prevMembers = baseSubtask.task.members
    const taskAuthor = baseSubtask.task.author
    const newMembers = newSubtask.task.members
    const subtasksMembers = [...new Set(subtasks.filter(subtask=>subtask.task.id!==subtaskId).map(subtask=>subtask.task.members.map(m=>m.endpoint.user.id).concat([subtask.task.author.user.id])).flat())]
    const parentTaskMembers = getMembersWithoutObserves(task.task.members).map(member=>member.endpoint.user.id)
    const parentObservers = getObservers(task.task.members).map(member=>member.endpoint.user.id)
    // 1) был ли какой-то пользователь удален или только добавились?
    const excludedMembers = prevMembers.reduce<ITaskMember[] | null>((acc,member)=>{
      const isExcluded = !newMembers.map(m=>m.endpoint.user.id).includes(member.endpoint.user.id)
      // 1-2) был ли исключенный автором?
      const isAuthor = member.endpoint.user.id === taskAuthor.user.id
      // 2) если 1 = true && этого пользователя нет в других подзадачах?
      const memberHasOtherSubtasks = subtasksMembers.includes(member.endpoint.user.id)
      // 3) если 1 = true && этот пользователь не является автором/исполнителем/соисполнителем основной задачи?
      const memberHasRoleInParent = parentTaskMembers.includes(member.endpoint.user.id)
      if (isExcluded && !isAuthor && !memberHasOtherSubtasks && !memberHasRoleInParent) {
        if (!acc) acc = [member]; else acc.push(member)
      }
    debugger
      return acc
    },null)

   console.log(`\x1b[36m excludedMembers \x1b[0m`,`: `, excludedMembers)
   if (excludedMembers) {
      const shouldRemoveObservers = excludedMembers.map(member=>member.endpoint.user.id).filter(member=>parentObservers.includes(member))
      console.log('из наблюдателей основной задачи необходимо удалить ', shouldRemoveObservers )
    }
    
    // наверно следующий шаг в отдельную функцию
    // 4) если  (2 = true & 3 = true ) && проверяем историю основной задачи, чтобы понять когда он был добавлен в список наблюдателей
    //
  }
  return null
}

const useStyles = makeStyles(FooterStyles);
const Footer: React.FC<Partial<IFooter>> = ({ isEdit = false, className, setEdit, ...props }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  

  const dispatch = useDispatch();
  const modules = useSelector(modulesSelector);
  const selfId = useSelector(selfIdSelector);
  const userId = useSelector(userIdSelector);
  const task = useSelector(taskSelector);
  const baseSubtask = useSelector(subtaskSelector);
  const subtasks = useAppSelector(subtasksSelector) 
  const history = useAppSelector(s=>s.tasksReducer.history)
  console.log(`\x1b[36m subtasks \x1b[0m`,`: `,subtasks)
  console.log(`\x1b[36m history  \x1b[0m`,`: `,task,history)
  const { task: subtask, setTask, validate } = useTaskDiscusContext();

  const { setType } = usePanelContext();
  const { setType: setTypeSubtask } = useSubtaskTypeContext();
  const { setTemplate } = useSubtaskTemplateContext();
  const status = useMemo(() => subtask?.task?.state?.status, [subtask]);

  const isExecutor = useMemo(() => checkSelfAsExecutor(selfId, subtask, modules), [selfId, subtask, modules]);

  const isEditable = useMemo(() => {
    const isAuthor = checkSelfAsAuthor(selfId, subtask, modules);
    const isCoExecutor = checkSelfAsCoExecutor(selfId, subtask, modules);

    return isAuthor || isExecutor || isCoExecutor;
  }, [selfId, subtask, modules]);

  const editTask = (newStatus: TasksStatus) => {
    if (!task || !subtask) return;

    const newTask = {
      ...subtask,
      task: {
        ...subtask.task,
        state: {
          status: newStatus,
        },
        editor: {
          ...subtask.task.editor,
          user: {
            ...subtask.task.editor.user,
            id: userId || subtask.task.editor.user.id,
          },
        },
      },
    };
    //TODO: Подумать как не удалять везде begin и не изменять каждый раз editor.id
    window.skifWebFrontend?.backend?.automation?.edit(newTask);
  };

  const onClickSave = () => {
    if (validate()) {
      debugger
      if (task && subtask) {
        //был ли кто-то исключен 
        const test = (subtasks && baseSubtask) ? isMemberWasExcluded(task,subtask,baseSubtask,Object.values(subtasks)) : null
        console.log('test', test)
        const updateTask = getUpdateTask(task, subtask);
        updateTask.task.state = { status: updateTask.task.state.status };
        updateTask.task.editor.user.id = userId || updateTask.task.editor.user.id;
        window.skifWebFrontend.backend.automation.edit(updateTask);

        const updateSubtask = getUpdateSubtask(task, subtask);
        updateSubtask.task.editor.user.id = userId || updateSubtask.task.editor.user.id;
        updateSubtask.task.state = { status: updateSubtask.task.state.status };
        window.skifWebFrontend.backend.automation.edit(updateSubtask);
      }

      if (setEdit && typeof setEdit === 'function') {
        setEdit(false);
      }
    }
  };

  const onClickCancellation = () => {
    if (baseSubtask) setTask(baseSubtask as IBaseTask<ITaskDiscus>);

    if (setEdit && typeof setEdit === 'function') {
      setEdit(false);
    }
  };

  const onClickEdit = () => {
    if (setEdit && typeof setEdit === 'function') {
      setEdit(true);
    }
  };

  const onClickComplete = () => {
    editTask(TasksStatus.Succeed);
    dispatch(setEditTasks(false));
  };

  const onClickRun = () => {
    editTask(TasksStatus.Running);
  };
  const onClickRepeat = () => {
    const type = subtask?.task.type;

    if (type) {
      const subtaskTemplate = getTaskToRepeat(subtask);

      setTemplate(subtaskTemplate);
      dispatch(setStateRightPanel(true));
      setType(PanelTypes.NewSubtask);
      setTypeSubtask(type);
    }
  };
  const showRepeatButton =
    task?.task.state.status !== TasksStatus.Archived &&
    // task?.task.state.status!==TasksStatus.Succeed &&
    task?.task.state.status !== TasksStatus.Failed &&
    checkSelfAsAuthor(selfId, subtask, modules);

  return (
    <FooterLayout className={clsx('active', className, classes.root)} {...props}>
      {showRepeatButton && (
        <UDSButton variant="primary" className={clsx('mr-16')} onClick={onClickRepeat}>
          Повторить
        </UDSButton>
      )}
      {!isEdit && status === TasksStatus.Awaiting && (
        <UDSButton
          variant="primary"
          className={clsx('mr-16')}
          disabled={!isExecutor || task?.task.state.status === TasksStatus.Awaiting}
          onClick={onClickRun}>
          Запустить
        </UDSButton>
      )}
      {!isEdit && status === TasksStatus.Running && (
        <UDSButton
          variant="primary"
          className={clsx('mr-16')}
          disabled={!isExecutor || task?.task.state.status === TasksStatus.Awaiting}
          onClick={onClickComplete}>
          Завершить
        </UDSButton>
      )}
      {subtask?.task.state.status !== TasksStatus.Succeed && !isEdit && isEditable && (
        <UDSButton onClick={onClickEdit}>Редактировать</UDSButton>
      )}
      {isEdit && (
        <>
          <UDSButton variant="primary" className={clsx('mr-16')} onClick={onClickSave}>
            Сохранить
          </UDSButton>
          <UDSButton onClick={onClickCancellation}>Отмена</UDSButton>
        </>
      )}
    </FooterLayout>
  );
};

export default Footer;
