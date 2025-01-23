export interface IWorkstation {
  alias: string;
  id: string;
  name: string;
  online: boolean;
}

export interface IModule {
  alias: string;
  id: string;
  name: string;
  workstation?: string;
  user?: string;
  online: boolean;
}

export interface IUser {
  alias: string;
  id: string;
  name: string;
  surname?: string;
  lastname?: string;
  online: boolean;
}

export interface IEsb {
  build: string;
  version: string;
}

export interface ISelfId {
  id: string;
}

export interface IStatusEsb {
  esb: IEsb;
  self: ISelfId;
}

export enum STATUS {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Failure = 'failure',
}
