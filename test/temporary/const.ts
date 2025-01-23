import { TKanbanGroups, TasksStatus } from "./types/tasksInterfaces";

export const Rights = {
  Observe: 0x1,
  Comment: 0x2,
  Assign: 0x4,
  Edit: 0x8,
  Turn: 0x16,
};

export const MemberRights = {
  author: Rights.Observe + Rights.Comment + Rights.Assign + Rights.Edit + Rights.Turn,
  executor: Rights.Observe + Rights.Comment + Rights.Edit + Rights.Turn,
  coExecutor: Rights.Observe + Rights.Comment + Rights.Edit,
  observer: Rights.Observe,
};

export const MemberRightsTitles = {
  author: 'Автор',
  executor: 'Исполнитель',
  coExecutor: 'Соисполнитель',
  observer: 'Наблюдатель',
};
export const TASK_STATUS: Record<TasksStatus, string> = {
  awaiting: 'Ожидание',
  running: 'В работе',
  succeed: 'Выполнено',
  failed: 'Ошибка',
  archived: 'В архиве',
};
export const TASK_GROUPS: TKanbanGroups<string> = {
  awaiting: 'В планах',
  running: 'В работе',
  succeed: 'Выполнено',
  archived: 'В архиве',
} as const;
export const TASK_GROUPS_COLOR: TKanbanGroups<string> = {
  awaiting: 'rgba(255,215,150,1)',
  running: 'rgba(254,152,155,1)',
  succeed: 'rgba(159,186,239,1)',
  archived: 'rgba(0,117,98,.15)',
} as const;
export const GROUP_TRANSFER_PERMISSIONS: TKanbanGroups<Array<TasksStatus>> = {
  awaiting: [TasksStatus.Running],
  running: [TasksStatus.Succeed],
  succeed: [TasksStatus.Archived, TasksStatus.Running],
  archived: [TasksStatus.Running],
} as const;
export const COMPLETED_STATUS_LIST = [TasksStatus.Succeed, TasksStatus.Failed];
export const ROUTES = {
  ConnectionPage: '/connection',
  TasksPage: '/tasks',
  SubtasksPage: '/subtasks',
} as const;

export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const SECONDS_PER_MINUTE = 60;
export const MILLISECONDS_PER_SECONDS = 1000;

export enum Themes {
  Dark = 'dark',
  Light = 'light',
}

export const timeFormat: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
};
export const CONFERENCES_MODULE_LIST = ['skif-task-list', 'skif-kanban'] as const;

export const MIN_PANEL_WIDTH = 430 as const;

export const DescriptionSelectVariants = {
  'text-editor': 'Текстовое описание',
  'blank-file': 'Бланк',
  'blank-update': 'Заменить бланк...',
} as const;
export const resolvedStatuses = [TasksStatus.Succeed, TasksStatus.Failed, TasksStatus.Archived];

export const TIME_TO_ARCHIVE_HISTORY_LABEL = 'Время до переноса в архив:';
export enum PanelTypes {
  NewTask = 'newTask',
  TaskInfo = 'taskInfo',
}
