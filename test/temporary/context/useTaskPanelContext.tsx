import * as React from 'react';
import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  IBaseTask,
  ITaskDiscus,
  ITaskMember,
  ITaskState,
  ITaskTimeframe,
  ITaskUser,
  ITaskTag,
  ITaskExtra,
  TasksStatus,
  TResponseParsedXml,
  TViewTask,
}  from '../types/tasksInterfaces';
import { v4 as uuidv4 } from 'uuid';
import { IFile } from '@skif/utils';
import { DescriptionSelectVariants } from '../const';
import { getExecutors } from '../../utils/usersUtils';
import { ViewerProvider } from './useViewerPayloadContext';

//TODO: сделать один контекст добавить сюда вариант, когда обрабатываем подзадачу типа TViewTask
export enum TaskErrors {
  Name = 'name',
  Executor = 'executor',
  Begin = 'begin',
  End = 'end',
}

export interface IErrors {
  name: string | null;
  executor: string | null;
  begin: string | null;
  end: string | null;
}

export type TDescriptionBaseVariant = {
  [K in keyof typeof DescriptionSelectVariants]: K extends 'blank-update' ? never : K;
}[keyof typeof DescriptionSelectVariants];

export interface ITaskDiscusContext {
  task: TViewTask | null;
  baseTask: TViewTask;
  errors: IErrors;
  descriptionVariant: TDescriptionBaseVariant | null;
  withDiscus: boolean;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setDescriptionVariant: (value: TDescriptionBaseVariant) => void;
  setFiles: (value: Array<IFile>) => void;
  setAuthor: (value: Record<'author', ITaskUser> | null) => void;
  setMembers: (value: Array<ITaskMember>) => void;
  setTimeframe: (value: ITaskTimeframe) => void;
  setState: (value: ITaskState) => void;
  setTask: (value: TViewTask) => void;
  setError: (name: TaskErrors | Array<TaskErrors>, value: string | null) => void;
  setTags: (tags: Record<string, ITaskTag>) => void;
  validate: () => boolean;
}

const initErrors: IErrors = {
  name: null,
  executor: null,
  begin: null,
  end: null,
};

const TaskPanelContext = createContext<ITaskDiscusContext | undefined>(undefined);

export interface ITaskPanelProvider {
  children: ReactNode;
  initTask: TViewTask;
  userId: string | undefined;
}
function isBaseTaskDiscus(task: TViewTask): task is IBaseTask<ITaskDiscus> {
  return task !== null && 'task' in task && 'discus' in task.task;
}
const TaskPanelProvider: FC<ITaskPanelProvider> = ({ children, initTask, userId }) => {
  const [task, setTask] = useState<TViewTask>(initTask);
  const [errors, setErrorTask] = useState<IErrors>(initErrors);
  const withDiscus = isBaseTaskDiscus(task);
  const descriptionVariant: TDescriptionBaseVariant | null = withDiscus
    ? task?.task.discus.description.type !== 'skif.text'
      ? 'blank-file'
      : 'text-editor'
    : null;
  const setName = React.useCallback(
    (value: string) => {
      if (!task) return;
      const updateTask = {
        ...task,
        task: {
          ...task.task,
          name: value,
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
          state: {
            status: task.task.state.status,
          },
        },
      } as TViewTask;

      setTask(updateTask);
    },
    [task, userId],
  );

  const setDescription = React.useCallback(
    (value: string) => {
      if (!task || !withDiscus) return;
      let currentType = '';
      try {
        currentType = JSON.parse(value).type;

        if (!currentType) throw new Error();
      } catch (error) {
        currentType = 'skif.text';
      }
      let description;

      if (currentType === 'skif.text') {
        if (value) {
          description = {
            meta: task.task.discus.description?.meta,
            type: task.task.discus.description?.type,
            payload: { ...task.task.discus.description?.payload, value },
          };
        } else {
          description = {
            meta: task.task.discus.description?.meta,
            type: task.task.discus.description?.type,
            payload: {
              ...task.task.discus.description?.payload,
            },
          };

          delete description.payload.value;
        }
      } else {
        const blank_payload = JSON.parse(value) as TResponseParsedXml;
        description = {
          meta: task.task.discus.description?.meta,
          type: blank_payload.type,
          payload: JSON.parse(blank_payload.payload),
        };
      }
      const updateTask = {
        ...task,
        task: {
          ...task.task,
          discus: {
            description,
          },
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
          state: {
            status: task.task.state.status,
          },
        },
      };
      setTask(updateTask);
    },
    [task, userId],
  );

  const setDescriptionVariant = React.useCallback(
    (newVariant: TDescriptionBaseVariant) => {
      // изменяем initial data
      if (!task || !withDiscus || !isBaseTaskDiscus(initTask)) return;
      let description = {
        meta: {
          id: initTask?.task.discus.description.meta.id || uuidv4(),
        },
        type: '',
        payload: {},
      };

      if (newVariant == 'text-editor') {
        description = {
          meta: {
            id: initTask?.task.discus.description?.meta?.id || uuidv4(),
          },
          type: 'skif.text',
          payload: {
            value: '',
          },
        };
      } else {
        description = {
          meta: {
            id: initTask?.task.discus.description.meta.id || uuidv4(),
          },
          type: '',
          payload: {},
        };
      }
      const updateTask: IBaseTask<ITaskDiscus> = {
        ...task,
        task: {
          ...task.task,
          discus: {
            description,
          },
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
          state: {
            status: task.task.state.status,
          },
        },
      };
      setTask(updateTask);
    },
    [task, initTask, userId],
  );

  const setFiles = React.useCallback(
    (value: Array<IFile>) => {
      if (!task || !withDiscus) return;
      const updateTask = {
        ...task,
        task: {
          ...task.task,
          discus: {
            ...task.task.discus,
            description: {
              ...task.task.discus?.description,
              payload: {
                ...task.task.discus?.description?.payload,
                files: [...value],
              },
            },
          },
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
          state: {
            status: task.task.state.status,
          },
        },
      };

      setTask(updateTask);
    },
    [task, userId],
  );

  const setAuthor = React.useCallback(
    (author: Record<'author', ITaskUser> | null) => {
      if (!task) return;
      const updateTask = {
        ...task,
        task: {
          ...task.task,
          ...author,
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
          state: {
            status: task.task.state.status,
          },
        },
      } as TViewTask;

      setTask(updateTask);
    },
    [task, userId],
  );

  const setMembers = React.useCallback(
    (members: Array<ITaskMember>) => {
      if (!task) return;
      const updateTask = {
        ...task,
        task: {
          ...task.task,
          members,
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
          state: {
            status: task.task.state.status,
          },
        },
      } as TViewTask;

      setTask(updateTask);
    },
    [task, userId],
  );

  const setTimeframe = React.useCallback(
    (timeframe: ITaskTimeframe) => {
      if (!task) return;
      const updateTask = {
        ...task,
        task: {
          ...task.task,
          timeframe,
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
          state: {
            status: task.task.state.status,
          },
        },
      } as TViewTask;

      setTask(updateTask);
    },
    [task, userId],
  );

  const setState = React.useCallback(
    (state: ITaskState) => {
      if (!task) return;
      const updateTask = {
        ...task,
        task: {
          ...task.task,
          state: {
            status: state.status,
          },
          editor: {
            ...task.task.editor,
            user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
          },
        },
      } as TViewTask;

      setTask(updateTask);
    },
    [task, userId],
  );

  const setTags = React.useCallback(
    (tags: Record<string, ITaskTag>) => {
      if (!task) return;
      try {
        const extraParse = JSON.parse(task.task.extra || JSON.stringify({})) as ITaskExtra;
        const extra = JSON.stringify({ ...extraParse, tags });
        const updateTask = {
          ...task,
          task: {
            ...task.task,
            extra,
            editor: {
              ...task.task.editor,
              user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
            },
            state: {
              status: task.task.state.status,
            },
          },
        } as TViewTask;
        setTask(updateTask);
      } catch (err) {
        console.log('Не удалось поменять теги', err);
      }
    },
    [task, userId],
  );

  const validateName = () => {
    if (!task?.task.name) {
      setError(TaskErrors.Name, 'Некорректное название задачи');

      return false;
    }
    setError(TaskErrors.Name, null);

    return true;
  };

  const validateExecutor = () => {
    if (!(getExecutors(task?.task?.members || null).length > 0)) {
      setError(TaskErrors.Executor, 'Исполнитель не выбран');

      return false;
    }
    setError(TaskErrors.Executor, null);

    return true;
  };

  const validateBegin = () => {
    const begin = task?.task.timeframe?.begin;
    const taskStatus = task?.task.state.status;

    if (taskStatus !== TasksStatus.Running && begin && begin < Date.now() / 1000) {
      setError(TaskErrors.Begin, 'Невозможно поставить задачу в прошлом');

      return false;
    }
    setError(TaskErrors.Begin, null);

    return true;
  };

  const validateEnd = () => {
    const begin = task?.task.timeframe?.begin;
    const end = task?.task.timeframe?.end;

    if (end) {
      if (end < Date.now() / 1000) {
        setError(TaskErrors.End, 'Невозможно поставить задачу в прошлом');

        return false;
      }

      if (end < (begin || Date.now() / 1000)) {
        setError(TaskErrors.End, 'Некорректный срок исполнения');

        return false;
      }
    }
    setError(TaskErrors.End, null);

    return true;
  };

  const validate = React.useCallback(() => {
    let result = true;

    result = validateName() && result;
    result = validateExecutor() && result;
    result = validateBegin() && result;
    result = validateEnd() && result;

    return result;
  }, [task, userId]);

  // TODO Подумать как переделать ошибки
  const setError = React.useCallback(
    (type: TaskErrors | Array<TaskErrors>, value: string | null) => {
      if (type && typeof type === 'string') {
        setErrorTask((prevState) => ({
          ...prevState,
          [type]: value,
        }));
      } else if (type && Array.isArray(type)) {
        setErrorTask((prev) => {
          const newErrors = { ...prev };
          type.forEach((item) => {
            newErrors[item] = value;
          });

          return newErrors;
        });
      }
    },
    [task, userId],
  );

  const value = useMemo(() => {
    return {
      task,
      baseTask:initTask,
      errors,
      descriptionVariant,
      withDiscus,
      setName,
      setDescription,
      setDescriptionVariant,
      setFiles,
      setAuthor,
      setMembers,
      setTimeframe,
      setState,
      setError,
      setTask,
      setTags,
      validate,
    };
  }, [
    task,
    initTask,
    errors,
    descriptionVariant,
    withDiscus,
    setName,
    setDescription,
    setDescriptionVariant,
    setFiles,
    setAuthor,
    setMembers,
    setTimeframe,
    setState,
    setError,
    setTags,
    validate,
  ]);

  useEffect(() => {
    setTask(initTask);
  }, [initTask]);

  return (
    <TaskPanelContext.Provider value={value}>
      <ViewerProvider>{children}</ViewerProvider>
    </TaskPanelContext.Provider>
  );
};

const useTaskPanelContext = () => {
  const context = useContext(TaskPanelContext);

  if (context === undefined) {
    throw new Error('useTaskPanelContext1 must be used within a TaskPanelProvider');
  }

  return context;
};

export { TaskPanelProvider, useTaskPanelContext };
