import { Backend } from '../../../../../../../../../../backendEmulator';
import { getMessageDateTimeString } from '../../../../../../../utils/converters';
import { CONFERENCES_MODULE_LIST } from '../../../../../../const';
import { IConferenceMember, ITaskConference, ITaskMessage } from '../../../../../../types/automationInterfaces';
import { IUser } from '../../../../../../types/esbInterfaces';
import { IBaseTask, IProcessSubtaskBase, ITaskDiscus, TSubtasks, TViewTask } from '../../../../../../types/tasksInterfaces';

export const getTaskMembers = (task: TViewTask) => task?.task.members || [];

export const updateConfMembers = (
  backend: Backend | null,
  conf: ITaskConference,
  newMembersList: IConferenceMember[],
): void => {
  const newConf = { ...conf, members: newMembersList };
  console.log('Обновляем список участников концеренции', newConf);

  if (backend?.automation?.comments?.update) backend?.automation?.comments.update(newConf);
  else console.error('Сервер конференций недоступен, обратитесь к разработчикам');
};

export const getMembersList = (
  task: NonNullable<TViewTask>,
  users: Record<string, IUser>,
  subtasks: Record<string, Record<string, TSubtasks | IProcessSubtaskBase>>,
) => {
  const taskId = task.task.id;

  if (taskId.length === 0 || !users || !task?.task.author) return null;

  const currentSubtasksMembers: Record<string, IConferenceMember> = (
    Object.values(subtasks[taskId]) as TSubtasks[]
  ).reduce((acc, el) => {
    const author: IConferenceMember = {
      role: '2',
      endpoint: {
        user: el.task.author.user,
      },
      modules: [...CONFERENCES_MODULE_LIST],
    };
    const members: IConferenceMember[] = el.task.members.map((member) => ({
      role: '2',
      endpoint: {
        user: member.endpoint.user,
      },
      modules: [...CONFERENCES_MODULE_LIST],
    }));
    members.forEach((member) => {
      (acc as Record<string, IConferenceMember>)[member.endpoint.user.id] = member;
    });
    (acc as Record<string, IConferenceMember>)[author.endpoint.user.id] = author;

    return acc;
  }, {});

  const membersTask = getTaskMembers(task).reduce<Record<string, IConferenceMember>>(
    (acc, member) => {
      acc[member.endpoint.user.id] = {
        role: '2',
        endpoint: {
          user: member.endpoint.user,
        },
        modules: [...CONFERENCES_MODULE_LIST],
      };

      return acc;
    },
    currentSubtasksMembers,
  );

  const conferenceAuthorID = task?.task.author.user.id;

  membersTask[conferenceAuthorID] = {
    role: '0',
    endpoint: {
      user: {
        id: conferenceAuthorID,
      },
    },
    modules: [...CONFERENCES_MODULE_LIST],
  };

  return Object.values(membersTask ?? {});
};

export const loadConference = (loadClb: (data:any,count:number)=>void, conferenceId: string = '') => {
  if (!loadClb) return;
  const data = {
    equal: {
      endpoint: {
        conference: conferenceId,
      },
    },
  };
  loadClb(data, 100);
};

export function sortMessagesByTimestamp(
  messages: Record<string, ITaskMessage> | null,
  deferMessages: Record<string, ITaskMessage> | null,
): ITaskMessage[] {
  const messagesObj = Object.values(deferMessages || {}).reduce(
    (acc, el) => {
      if (!acc[el.message.meta.id]) acc[el.message.meta.id] = el;

      return acc;
    },
    { ...messages },
  );

  return Object.values(messagesObj).sort((a, b) => a.attributes.sent! - b.attributes.sent!);
}

export function groupMessagesByDate(
  messages: ITaskMessage[] | null,
): Record<string, ITaskMessage[]> | null {
  if (!messages || messages.length === 0) return null;

  const groupedMessages = messages.reduce<Record<string, ITaskMessage[]>>((acc, message) => {
    const { date } = getMessageDateTimeString(message.attributes.sent);

    if (!acc[date]) {
      acc[date] = [message];
    } else {
      acc[date].push(message);
    }

    return acc;
  }, {});

  return groupedMessages ?? null;
}

export const initConference = (
  task: IBaseTask<ITaskDiscus>,
  users: Record<string, IUser>,
  subtasks: Record<string, Record<string, TSubtasks | IProcessSubtaskBase>>,
) => {
  const taskId = task.task.id;

  if (taskId.length === 0 || !users || !task?.task.author) return null;

  const membersList = getMembersList(task, users, subtasks);
  const newConf = {
    id: taskId,
    name: task?.task.name,
    members: membersList,
  };
  console.log('создаем новую conference', JSON.stringify(newConf, null, 2));
  if (window.skifWebFrontend.backend?.automation?.comments?.add)
    window.skifWebFrontend.backend?.automation?.comments.add(newConf);
  else console.error('Сервер конференций недоступен, обратитесь к разработчикам');
};

export const getMemberInitials = (member: IUser | null | undefined): string => {
  let memberInitials = '';

  if (!member) return memberInitials;
  const { name, surname } = member;

  if (surname && surname?.[0]) memberInitials = surname[0] + memberInitials;

  if (name && name?.[0]) memberInitials = memberInitials + name[0];

  return memberInitials.split('').join(' ');
};
