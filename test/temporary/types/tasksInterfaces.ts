import { IFile, TSchemasFindValue } from '@skif/utils';
import { IMessage, IGrade } from './automationInterfaces';
export type TKanbanGroups<T> = Record<Exclude<TasksStatus, 'failed'>, T>;

export type TAllTasks = IBaseTask<ITaskPFMonitor> | TAllTasksMembers;

export type IAllTasks = Record<string, NonNullable<TViewTask>>;
//TODO использовать или убрать
export type IGroupedSubtasks = Record<
  string,
  Record<string, IBaseTask<ITaskDiscus> | IBaseTask<ITaskProcess>>
>;

export type TAllTasksMembers =
  | IBaseTask<ITaskPFFlow>
  | IBaseTask<ITaskDiscus>
  | IBaseTask<ITaskProcess>
  | IBaseTask<ITaskProcessTask>
  | IBaseTask<ITaskPFMilestone>;

export type TAllTasksTimeframe = TAllTasksMembers;

export type TSubtasks =
  | IBaseTask<ITaskDiscus>
  | IBaseTask<ITaskPFFlow>
  | IBaseTask<ITaskProcess>
  | IBaseTask<ITaskProcessTask>
  | IBaseTask<ITaskPFMilestone>;

export interface ITaskUser {
  module: {
    alias: string;
  };
  user: {
    id: string;
  };
  workstation?: {
    id: string;
  };
}
export type TViewTask =
  | IBaseTask<ITaskDiscus>
  | IBaseTask<ITaskProcess>
  | IBaseTask<ITaskPFFlow>
  | null;

export interface ITaskState {
  begin?: number;
  status: TasksStatus;
}

export interface ITaskMember {
  endpoint: ITaskUser;
  rights: number;
}

export interface ITaskTag {
  name: string;
  color: string;
}

export interface ITaskExtra {
  tags: Record<string, ITaskTag>;
  grade: IGrade;
  viewed: Array<string>;
  version?: {
    minor: number;
    major: number;
  };
}
export enum TaskColor {
  red = '#E15759',
  orange = '#F28E2C',
  yellow = '#FFCD02',
  green = '#2ECC71',
  blueLight = '#37A0E7',
  violet = '#C555FF',
  blue = '#4866BD',
  gray = '#A4A4A9',
  brown = '#8E725E',
  grayDark = '#393C3D',
}

export interface ITaskTimeframe {
  begin?: number;
  lifetime?: number;
  end?: number;
}

export interface ITaskHistoryOptions {
  currentTask: string;
  currentSubtask: string;
  typesSubtask: TypesTask;
}

export interface ITaskHistory {
  date: number;
  editor: string;
  description: string;
  typeHistory: TypesTaskHistory;
  options?: ITaskHistoryOptions;
}

export enum TypesTaskHistory {
  Date = 'date',
  Archive = 'archive',
  Members = 'members',
  Status = 'status',
  Subtasks = 'subtasks',
  Tags = 'tags',
  Grade = 'Grade',
  Viewed = 'viewed',
}

export enum FocusDestinationModuleTypes {
  Discus = 'task-list',
  Process = 'flowchart',
  Paperflow = 'paperflow',
}

export enum TypesTask {
  PfMonitor = 'pf.monitor',
  PfFlow = 'pf.flow',
  Discus = 'discus',
  Process = 'process',
  ProcessTask = 'process.task',
  PfMilestone = 'pf.milestone',
}

export enum TasksStatus {
  Awaiting = 'awaiting',
  Running = 'running',
  Succeed = 'succeed',
  Failed = 'failed',
  Archived = 'archived',
}

export interface ITask {
  author: ITaskUser;
  editor: ITaskUser;
  id: string;
  name: string;
  state: ITaskState;
  type: TypesTask;
  extra: string;
}

export type TPayloadMessage = {
  id: null | Array<TPayloadMessage> | Record<string, TPayloadMessage>;
};

export interface IBaseTask<T = ITask> {
  parent?: string;
  task: T;
  message?: IMessage<Record<string, TPayloadMessage>>;
}

export interface ITaskPFMonitor extends ITask {
  'pf.monitor': {
    online: boolean;
    roadmaps: Array<string>;
  };
  type: TypesTask.PfMonitor;
}

export interface IMilestones {
  id: string;
  performer: {
    user: {
      id: string;
    };
  };
}
export interface ITaskPFFlowPF {
  milestones: Array<IMilestones>;
  roadmap: string;
  roadmapLenght: number;
}

export interface ITaskPFFlow extends ITask {
  members: Array<ITaskMember>;
  'pf.flow': ITaskPFFlowPF;
  type: TypesTask.PfFlow;
  timeframe: ITaskTimeframe;
}

export interface ITaskDiscus extends ITask {
  members: Array<ITaskMember>;
  discus: {
    description: {
      meta: {
        id: string;
      };
      payload: {
        files?: Array<IFile>;
        value?: string;
      };
      type: string;
    };
  };
  type: TypesTask.Discus;
  timeframe: ITaskTimeframe;
}

export interface ITaskProcess extends ITask {
  members: Array<ITaskMember>;
  process: {
    schema: string;
  };
  type: TypesTask.Process;
  timeframe: ITaskTimeframe;
}

export interface ITaskProcessTask extends ITask {
  members: Array<ITaskMember>;
  process: {
    schema: string;
  };
  type: TypesTask.ProcessTask;
  timeframe: ITaskTimeframe;
}

export interface ITaskPFMilestone extends ITask {
  members: Array<ITaskMember>;
  'pf.flow': {
    milestones: [];
  };
  'pf.milestone': {
    performer: {
      user: object;
    };
  };
  type: TypesTask.PfMilestone;
  timeframe: ITaskTimeframe;
}

export const isTaskMembers = (task: TAllTasks): task is TAllTasksMembers =>
  !!(task as TAllTasksMembers).task.members;
export const isTaskTimeframe = (task: TAllTasks): task is TAllTasksTimeframe =>
  !!(task as TAllTasksTimeframe).task.timeframe;
export const isTaskDiscus = (task: TAllTasks): task is IBaseTask<ITaskDiscus> =>
  task.task.type === TypesTask.Discus;
export const isTaskProcess = (
  task: TAllTasks | NonNullable<TViewTask>,
): task is IBaseTask<ITaskProcess> => task.task.type === TypesTask.Process;
export const isTaskPaperflow = (task: TAllTasks): task is IBaseTask<ITaskPFFlow> =>
  task.task.type === TypesTask.PfFlow;

export enum TypesProcessSubtask {
  Start = 'start',
  Stop = 'stop',
  Send = 'send',
  Receive = 'receive',
  Show = 'show',
  Convert = 'convert',
  Branch = 'branch',
}

export interface ITaskProcessSubtask extends Omit<ITask, 'type'> {
  type: TypesProcessSubtask;
}

export interface IProcessSubtaskBase {
  parent: string;
  task: ITaskProcessSubtask;
  message?: IMessage<Record<string, string>>;
  blank?: {
    payload: string;
  };
}

export type TResponseParsedXml = TSchemasFindValue & {
  name: string;
  v1type: string;
  type: string;
  payload: string;
  schema: {
    properties: {
      [key: string]: {
        type: string;
        items: {
          type: string;
          properties: {
            [key: string]: {
              type: string;
              default?: number;
              minimum?: number;
              maximum?: number;
            };
          };
        };
      };
    };
  };
};

export type TClick = {
  taskId: string;
  subtaskId: string;
  typeHistory: TypesTaskHistory;
  subtaskType: TypesTask.PfFlow | TypesTask.Discus | TypesTask.Process;
};