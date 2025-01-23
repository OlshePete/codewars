import { IFile } from '@skif/utils';
import { IModule } from './esbInterfaces';
import { TAllTasks } from './tasksInterfaces';

export interface IMessage<T> {
  meta?: {
    id: string;
  };
  payload: T;
  type: string;
}

export interface IStatusAutomation {
  module: IModule;
  protocol?: IProtocol;
}

export interface IProtocol {
  version: {
    major: number;
    minor: number;
  };
}

export interface ISchemas {}

export interface IGradeReport {
  task_message_id: string;
  error: string;
}

export enum STATUS {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Failure = 'failure',
}

export interface IGrade {
  expediency: number;
  currentData: number;
}

export interface ITimeliness {
  subtask_message_id: string;
  grade: IGrade;
}

export interface IGradeAndTimeliness {
  task: Record<'task_message_id', string>;
  subtasks: Array<ITimeliness>;
  subtasks_order: Array<string>;
}

export interface IRecommendations {
  recommendations: Array<Record<string, IRecommendation>> | null;
  task: string;
}

export interface IRecommendation {
  accuracy: number;
  task: TAllTasks;
}

export interface ITasksSettingsSchema {
  version: {
    major: number;
    minor: number;
  };
  lifetime: number;
  deadlinesColors: Array<IDeadlineColor>;
}
export interface IDeadlineColor {
  color: string;
  range: {
    min: number;
    max: number | null;
  };
}

export interface IConferenceMember {
  endpoint: {
    user: {
      id: string;
    };
  };
  role: string;
  modules: string[];
}
export interface ITaskConference {
  id: string;
  name: string;
  members: IConferenceMember[];
}
export interface IMessageBase {
  payload: {
    value: string;
    files: IFile[];
  };
  type: string;
  meta: { id: string; parent?: string };
}
export interface ITaskMessage {
  attributes: Partial<Record<'accepted' | 'sent' | 'delivered', number>>;
  endpoint: {
    user: string;
    conference?: string;
    module?: string | string[];
  };
  message: IMessageBase;
}
export interface ITaskMessageStatusUpdate {
  conferenceId: string;
  messageId: string;
  newStatus: Record<'accepted' | 'sent' | 'delivered', number>;
}
