import * as React from 'react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { UDSAccordion, UDSAccordionContent, UDSAccordionHeader } from '@uds/react-components';
import { Select } from './components/Select';
import { EditTaskMembersStyles } from './EditTaskMembers.styles';
import {
  createCoExecutors,
  createExecutors,
  createObservers,
  getDefaultCoExecutors,
  getDefaultExecutors,
  getDefaultObservers,
} from './utils';
import type { IMembers } from './EditTaskMembers.types';
import './EditTaskMembers.scss';
import { ISelectMember } from './components/Select/Select.types';
import { usePanelDataContext } from '../../../../../../../context/usePanelDataContext';

const useStyles = makeStyles(EditTaskMembersStyles);
const EditTaskMembers: React.FC<IMembers> = ({
  members,
  setMembers,
  className,
  error,
  setError,
  userList,
  color,
  onlyExecutor = false,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { users, modules, userModules } = usePanelDataContext();

  const [executors, setExecutors] = useState(getDefaultExecutors(members, userList || users));
  const [coExecutors, setCoExecutors] = useState(getDefaultCoExecutors(members, userList || users));
  const [observers, setObservers] = useState(getDefaultObservers(members, userList || users));

  const colorTask10 = rgbaToHex(hexToRGBA(color ?? '', 0.1));
  const colorTask20 = rgbaToHex(hexToRGBA(color ?? '', 0.2));

  useEffect(() => {
    setExecutors(getDefaultExecutors(members, userList || users));
    setCoExecutors(getDefaultCoExecutors(members, userList || users));
    setObservers(getDefaultObservers(members, userList || users));
  }, [members]);

  const updateTaskExecutor = (newExecutors: Array<{ fullName: string; id: string }>) => {
    const updatingExecutors: ISelectMember[] = [];

    if (newExecutors.length > 0) {
      updatingExecutors.push(newExecutors[newExecutors.length - 1]);
    }
    setExecutors(updatingExecutors);
    const filteredCoExecutors = coExecutors.filter(
      ({ id }) => !updatingExecutors.map((m) => m.id).includes(id),
    );
    const filteredObservers = observers.filter(
      ({ id }) => !updatingExecutors.map((m) => m.id).includes(id),
    );
    const newMembers = [
      ...createExecutors(updatingExecutors, modules, userModules),
      ...createCoExecutors(filteredCoExecutors, modules, userModules),
      ...createObservers(filteredObservers, modules, userModules),
    ];

    if (typeof setMembers === 'function') {
      setMembers(newMembers);
    }
  };

  const updateTaskCoExecutor = (newCoExecutors: Array<{ fullName: string; id: string }>) => {
    setCoExecutors(newCoExecutors);
    const filteredObservers = observers.filter(
      ({ id }) => !newCoExecutors.map((m) => m.id).includes(id),
    );
    const newMembers = [
      ...createExecutors(executors, modules, userModules),
      ...createCoExecutors(newCoExecutors, modules, userModules),
      ...createObservers(filteredObservers, modules, userModules),
    ];

    if (typeof setMembers === 'function') {
      setMembers(newMembers);
    }
  };

  const updateTaskObserver = (newObservers: Array<{ fullName: string; id: string }>) => {
    setObservers(newObservers);
    const newMembers = [
      ...createExecutors(executors, modules, userModules),
      ...createCoExecutors(coExecutors, modules, userModules),
      ...createObservers(newObservers, modules, userModules),
    ];

    if (typeof setMembers === 'function') {
      setMembers(newMembers);
    }
  };

  return (
    <UDSAccordion isOpen className={clsx('Members', 'br-none', className, classes.root)}>
      <UDSAccordionHeader label="Участники" style={{ backgroundColor: colorTask20 }} />
      <UDSAccordionContent style={{ backgroundColor: colorTask10 }}>
        <Select
          title={onlyExecutor ? 'Исполнитель' : 'Исполнители'}
          selected={executors}
          changeSelected={updateTaskExecutor}
          errorExecutor={error}
          setError={setError}
          userList={userList}
          excluded={[]}
        />
        {!onlyExecutor && (
          <>
            <Select
              title="Соисполнители"
              selected={coExecutors}
              changeSelected={updateTaskCoExecutor}
              userList={userList}
              excluded={executors}
            />
            <Select
              title="Наблюдатели"
              selected={observers}
              changeSelected={updateTaskObserver}
              userList={userList}
              excluded={[...executors, ...coExecutors]}
            />
          </>
        )}
      </UDSAccordionContent>
    </UDSAccordion>
  );
};

export default EditTaskMembers;
