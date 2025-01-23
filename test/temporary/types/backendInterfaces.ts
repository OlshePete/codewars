import {
  IBackend as Backend,
  IEsb,
  IFileSystem,
  IFileSystemMimes,
  IFileSystemPDropdown,
  IFileSystemPaths,
} from '@skif/utils';

export interface IBackendEsb extends IEsb {}
export interface IBackendEsbClients {
  subscribe(value: ISubscribeEsbClient): void;
  unsubscribe(): void;
}

export interface ISubscribeEsbClient {
  any: Record<any, any>;
}

export interface IBackendEsbFiles {
  upload(path: string, cb: TUploadCallback): void;
  downloads: IDownloadsEsbFiles;
}

export type TUploadCallback = (response: { value: IResponseUploadFile; error?: string }) => void;

export interface IResponseUploadFile {
  path: string;
  name: string;
  token: number;
  size: number;
}

export interface IDownloadsEsbFiles {
  start(token: number): void;
  cancel(token: number): void;
}

export interface IBackendEsbMessages {
  send(): void;
  subscribe(): void;
  unsubscribe(): void;
  schemas: IEsbMessagesSchemas;
}

export interface IEsbMessagesSchemas {
  find(type: string, cb: TSchemasFindCallback): void;
  v1reader: ISchemasV1reader;
  v1writer: {};
}

export interface ISchemasV1reader {
  json(doc: string, cb: TV1readerJsonCallback): void;
  xml(doc: string, cb: TV1readerXmlCallback): void;
}

export interface IBackendEsbStatus {
  subscribe(): void;
  unsubscribe(): void;
}

export interface IBackendFS extends IFileSystem {
  dropdown: IFileSystemPDropdown;
  paths: IFileSystemPaths;
  mimes: IFileSystemMimes;
}

type TSchemasFindCallback = (response: TSchemasFindValue) => void;
type TFilesCallback = (response: { value: Array<string>; error?: string }) => void;
type TReadCallback = (response: { value: string; error?: string }) => void;
type TV1readerXmlCallback = (response: { value: TV1readerValue; error?: string }) => void;
type TV1readerJsonCallback = (response: { value: TV1readerValue; error?: string }) => void;
type TV1readerValue = {
  type: string;
  ui: Document;
  blank: Array<Record<string, any>>;
};
export type TSchemasFindValue = {
  ui: Document;
  blank: Array<Record<string, any>>;
  error?: string;
};

export interface IBackendNotifications {
  push(value: IBackendNotification): void;
}

export interface IBackendNotification {
  level: number;
  message: string;
  destination: {
    popup: boolean;
  };
}
