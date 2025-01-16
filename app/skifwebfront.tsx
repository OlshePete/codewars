import '@uds/polyfills/webcomponents';
import { UDSNotification } from '@uds/components';
import { Automation } from './frontend/automation';
import { Esb as FrontendEsb } from './frontend/esb';
import { Application } from './application';
import { store } from './redux/store';
import { addSubtask, addTask, setTasksUpload } from './redux/actions/tasks';
import { addPaperflow } from './redux/actions/paperflow';
import { addPathToFiles, addSchemas } from './redux/actions/automation';
import { IBackend, TSchemasFindValue } from './types/backendInterfaces';
import { IBaseTask, ITaskDiscus, ITaskPFMonitor, TAllTasks, TSubtasks, TypesTask } from './types/tasksInterfaces';
import { Backend } from './backendEmulator';
import { FileDialogPool, FilePool, FrontendFileSystem } from '@skif/utils';
import Form from './form';

export default class SkifWebFrontend {
  private static instance: SkifWebFrontend;
  public fileDialogPool: FileDialogPool | null = null;
  public filePool: FilePool | null = null;
  public fs: FrontendFileSystem | null = null;
  public automation: Automation = new Automation();
  public esb: FrontendEsb = new FrontendEsb();
  // @ts-ignore
  public backend: IBackend = new Backend();
  public app: Application | null = null;
  private recommendationRequests: string[] = [];
  public form = new Form();
  private timeoutId: NodeJS.Timeout | null = null;
  constructor() {
    if (SkifWebFrontend.instance) {
      // eslint-disable-next-line no-constructor-return
      return SkifWebFrontend.instance;
    }

    SkifWebFrontend.instance = this;
  }

  public init(backend: IBackend) {
    try {
      this.backend = backend;
      this.fileDialogPool = FileDialogPool.getInstance();
      this.fileDialogPool.setDialog( this.backend.fs.dialog)
      this.filePool = FilePool.getInstance();
      this.fs = FrontendFileSystem.getInstance();
      this.fs.setFileDialogPool(this.fileDialogPool);
      this.esb.setFilePool(this.filePool);
      this.app = new Application(this.backend, this.fileDialogPool, this.filePool);
      this.app.init();

      this.backend.esb.status.subscribe();
      this.backend.esb.clients.subscribe({ any: {} });

      this.getAutomationSchemas();

      this.backend.handshake();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      // eslint-disable-next-line no-new
      new UDSNotification({
        type: 'error',
        message: 'Не удалось запустить приложение. Обратитесь к разработчикам',
      });
    }
  }

  public historyEnd() {
    store.dispatch(setTasksUpload());
  }

  public info(json: Array<TAllTasks>) {
    json.forEach(item => {
      if (item.task.type === TypesTask.Discus && !item.parent) {
        store.dispatch(addTask(item as IBaseTask<ITaskDiscus>));
      } else if (item.task.type === TypesTask.PfMonitor) {
        store.dispatch(addPaperflow(item as IBaseTask<ITaskPFMonitor>));
      } else {
        store.dispatch(addSubtask(item as TSubtasks));
      }

      // TODO: временно для параграфа
      if (
        item.task.id &&
        !item.parent &&
        !this.recommendationRequests.includes(item.task.id) &&
        !store.getState().automationReducer.recommendations[item.task.id]
      ) {
        this.recommendationRequests.push(item.task.id);
        this.getRecommendations(item);
      } else if (
        item.parent &&
        !this.recommendationRequests.includes(item.parent) &&
        !store.getState().automationReducer.recommendations[item.parent]
      ) {
        this.recommendationRequests.push(item.parent);
        this.getRecommendations(item);
      }
    });
  }

  public getRecommendations(task: TAllTasks) {
    // TODO пока предполагаем, что задача всегда Discus и рекомендации тоже всегда Discus
    if (task.task.type === TypesTask.Discus) {
      if (task.parent) {
        window.skifWebFrontend.backend?.automation?.requestRecommendations(task.parent);
      } else {
        window.skifWebFrontend.backend?.automation?.requestRecommendations(task.task.id);
      }
    }
  }

  public removeRecommendationsRequest(id: string) {
    const index = this.recommendationRequests.findIndex(elem => elem === id);

    if (index !== -1) {
      this.recommendationRequests.splice(index, 1);
    }
  }

  public json(doc: string) {
    if (!doc) {
      return Promise.reject(new Error('Не удалось получить документ'));
    }

    return new Promise((resolve, reject) => {
      this.getV1reader()?.json(doc, response => {
        if (!response || response.error) {
          reject(new Error('Не удалось конвертировать документ для отображения'));
        }
        resolve(response);
      });
    });
  }

  public xml(doc: string): Promise<{ value: TSchemasFindValue }> {
    if (!doc) {
      return Promise.reject(new Error('Не удалось получить документ'));
    }

    return new Promise((resolve, reject) => {
      this.getV1reader()?.xml(doc, response => {
        if (!response || response.error) {
          reject(new Error('Не удалось конвертировать документ для отображения'));
        }
        resolve(response);
      });
    });
  }

  private getV1reader() {
    return this.backend?.esb?.messages?.schemas?.v1reader;
  }

  public find(type: string): Promise<TSchemasFindValue> {
    return new Promise((resolve, reject) => {
      this.backend?.esb?.messages?.schemas?.find(type, response => {
        if (!response || response.error) {
          reject(new Error('Не удалось найти документ для отображения'));
        }

        resolve(response);
      });
    });
  }

  private getAutomationSchemas() {
    const basePath = `${this.backend?.fs.paths.home}/Skif/automation/`;
    store.dispatch(addPathToFiles(basePath));

    const promise = new Promise((resolve: (response: Array<string>) => void, reject) => {
      this.backend?.fs.files(basePath, response => {
        if (!response || response.error) {
          reject(new Error('Не удалось найти документ для отображения'));
        }
        resolve(response.value);
      });
    });

    promise
      .then(response => Promise.all(response.map(path => this.readFile(basePath, path))))
      .then(result => {
        store.dispatch(addSchemas(result));
      });
  }

  private readFile(basePath: string, path: string) {
    return new Promise((resolve, reject) => {
      this.backend?.fs.read(basePath + path, response => {
        if (!response) {
          reject(new Error('Не удалось прикрепить файл'));
        } else {
          if (response.error) {
            reject(new Error(`Не удалось прикрепить файл: ${response.error}`));
          }

          if (response.value) {
            resolve({ [path]: JSON.parse(response.value) });
          }
        }
      });
    });
  }
}

window.skifWebFrontend = new SkifWebFrontend();
