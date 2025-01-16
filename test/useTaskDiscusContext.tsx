import * as React from 'react';
import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { isNumber } from '@uds/utils';
import { getExecutors } from '../utils';
import {
  IFile,
  IBaseTask,
  ITaskDiscus,
  ITaskMember,
  ITaskState,
  ITaskTimeframe,
  ITaskUser,
  ITaskTag,
  ITaskExtra,
} from '../../types/tasksInterfaces';
import { TResponseParsedXml } from '../components/EditTaskDescription/EditTaskDescription';
import { DescriptionSelectVariants } from '../consts';

//TODO: сделать один контекст
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
 [K in keyof typeof DescriptionSelectVariants]: K extends 'blank-update' ? never : K
}[keyof typeof DescriptionSelectVariants]


export interface ITaskDiscusContext {
  task: IBaseTask<ITaskDiscus> | null;
  errors: IErrors;
  descriptionVariant:TDescriptionBaseVariant;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setDescriptionVariant: (value: TDescriptionBaseVariant) => void;
  setFiles: (value: Array<IFile>) => void;
  setAuthor: (value: Record<'author', ITaskUser> | null) => void;
  setMembers: (value: Array<ITaskMember>) => void;
  setTimeframe: (value: ITaskTimeframe) => void;
  setState: (value: ITaskState) => void;
  setTask: (value: IBaseTask<ITaskDiscus>) => void;
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

const TaskDiscusContext = createContext<ITaskDiscusContext | undefined>(undefined);

export interface ITaskDiscusProvider {
  children: ReactNode;
  initTask: IBaseTask<ITaskDiscus> | null;
  userId: string | undefined;
}
const TaskDiscusProvider: FC<ITaskDiscusProvider> = ({ children, initTask, userId }) => {
  const [task, setTask] = useState<IBaseTask<ITaskDiscus> | null>(initTask);
  const [errors, setErrorTask] = useState<IErrors>(initErrors);
  const [descriptionVariant, setDescriptionType] = useState<TDescriptionBaseVariant>(task?.task.discus.description.type!=='skif.text'?'blank-file':'text-editor')

  const setName = (value: string) => {
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
    };

    setTask(updateTask);
  };

  const setDescription = (value: string) => {
    if (!task) return;
    let currentType = ""
    try {
      currentType = JSON.parse(value).type
    } catch (error) {
      currentType = 'skif.text'
    }
    let description;
  if (descriptionVariant === 'text-editor' && currentType ==='skif.text') {
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
      console.log(`\x1b[36m времменная заглушка на описание\x1b[0m`,`: `,JSON.parse(value))
      const blank_payload = JSON.parse(value) as TResponseParsedXml
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
    //@ts-ignore
    setTask(updateTask);
  };

  const setDescriptionVariant = (newVariant:TDescriptionBaseVariant) => {
    setDescriptionType(newVariant)
  };

  const setFiles = (value: Array<IFile>) => {
    if (!task) return;
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
  };

  const setAuthor = (author: Record<'author', ITaskUser> | null) => {
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
    };

    setTask(updateTask);
  };

  const setMembers = (members: Array<ITaskMember>) => {
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
    };

    setTask(updateTask);
  };

  const setTimeframe = (timeframe: ITaskTimeframe) => {
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
    };

    setTask(updateTask);
  };

  const setState = (state: ITaskState) => {
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
    };

    setTask(updateTask);
  };

  const setTags = (tags: Record<string, ITaskTag>) => {
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
      };
      setTask(updateTask);
    } catch (err) {
      console.log('Не удалось поменять теги');
    }
  };

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

    if (begin && begin < Date.now() / 1000) {
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

  const validate = () => {
    let result = true;

    result = validateName() && result;
    result = validateExecutor() && result;
    result = validateBegin() && result;
    result = validateEnd() && result;

    return result;
  };

  // TODO Подумать как переделать ошибки
  const setError = (type: TaskErrors | Array<TaskErrors>, value: string | null) => {
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
  };

  const value = useMemo(
    () => ({
      task,
      errors,
      descriptionVariant,
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
    }),
    [task, errors, descriptionVariant],
  );

  useEffect(() => {
    setTask(initTask);
  }, [initTask]);

  useEffect(() => {
    // console.log('te')
    setDescriptionVariant(task?.task.discus.description.type !== 'skif.text' ? 'blank-file':'text-editor')
  }, [task]);

  return <TaskDiscusContext.Provider value={value}>{children}</TaskDiscusContext.Provider>;
};

const useTaskDiscusContext = () => {
  const context = useContext(TaskDiscusContext);

  if (context === undefined) {
    throw new Error('useTaskDiscusContext must be used within a TaskDiscusProvider');
  }
  return context;
};

export { TaskDiscusProvider, useTaskDiscusContext };
