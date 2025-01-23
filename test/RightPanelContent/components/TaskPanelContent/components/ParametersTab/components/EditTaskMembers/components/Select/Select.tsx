import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import {
  UDSCheckbox,
  UDSChip,
  UDSInput,
  UDSTitle,
  ClickAwayListener,
  UDSScroll,
} from '@uds/react-components';
import { SelectStyles } from './Select.styles';
import type { ISelectMember, ISelectMembers } from './Select.types';
import './Select.scss';
import { makeStyles, useTheme } from '@uds/utils';
import { usePanelDataContext } from '../../../../../../../../../SkifTaskPanel/context2/usePanelDataContext';
import { TaskErrors } from '../../../../../../../../../SkifTaskPanel/context2/useTaskPanelContext';
import { getUserFullName } from '../../../../../../../../../kanban/utils/usersUtils';
import { IUser } from '../../../../../../../../../../../types/esbInterfaces';

// TODO пересмотреть хранение пользователей для оптимизации поиска

const useStyles = makeStyles(SelectStyles);

const Select: React.FC<ISelectMembers> = ({
  title,
  selected,
  changeSelected,
  userList,
  errorExecutor,
  isDisabled,
  setError,
  excluded,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { users } = usePanelDataContext();

  const spanMore = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchedMembers, setSearchedMembers] = useState(Object.values(userList || users));
  const [searchedSelectedMembers, setSearchedSelectedMembers] = useState(selected);
  const [isOpenDropDown, setOpenDropDown] = useState(false);
  const [isOpenDropDownWithMore, setOpenDropDownWithMore] = useState(false);
  const [search, setSearch] = useState('');

  const openSelect = (event: React.FormEvent<HTMLElement>) => {
    if (isDisabled) return;

    if (setError instanceof Function) {
      setError(TaskErrors.Executor, null);
    }

    if (event.target !== spanMore.current) {
      setOpenDropDown(!isOpenDropDown);

      if (isOpenDropDown) {
        setSearch('');
        setSearchedMembers(Object.values(userList || users));
      }
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLInputElement>, value?: string) => {
    const targetStr = value ? value.toLocaleLowerCase() : '';
    setSearch(value ? value : '');

    if (targetStr === '') {
      setSearchedMembers(Object.values(userList || users));
    } else {
      const result = Object.values(userList || users).filter((user) =>
        getUserFullName(user).toLowerCase().includes(targetStr),
      );
      setSearchedMembers(result);
    }
  };

  const handleSearchSelected = (e: React.FormEvent<HTMLInputElement>) => {
    const targetStr = e.currentTarget.value.toLowerCase();

    if (targetStr === '') {
      setSearchedSelectedMembers(selected);
    } else {
      const result = selected.filter((user) => user.fullName.toLowerCase().includes(targetStr));
      setSearchedSelectedMembers(result);
    }
  };

  const selectMember = (e: React.FormEvent<HTMLElement>, value?: boolean) => {
    let newSelected;

    if (value) {
      newSelected = [
        ...selected,
        {
          id: e.currentTarget.dataset.userId as string,
          fullName: e.currentTarget.dataset.fullName as string,
        },
      ];
    } else {
      newSelected = removeMember(e.currentTarget.dataset.userId as string);
    }
    changeSelected(newSelected);
  };

  const handleRemoveChip = (e: React.FormEvent<HTMLElement>, id: string) => {
    e.stopPropagation();
    const userId = id;

    if (userId !== undefined) {
      const newSelected = removeMember(userId);
      changeSelected(newSelected);
    }
  };

  const removeMember = (id: string) => selected.filter((select) => select.id !== id);

  useEffect(() => {
    setSearchedMembers(Object.values(userList || users));
  }, [userList, users]);

  useEffect(() => {
    setSearchedSelectedMembers(selected);
  }, [selected]);

  useEffect(() => {
    if (inputRef.current && isOpenDropDown) {
      inputRef.current.focus();
    }
  }, [inputRef, isOpenDropDown]);

  const createChip = (id: string, fullName: string) => (
    <UDSChip
      className={clsx('mr-4')}
      size="small"
      type="gray"
      key={id}
      variant="deletable"
      onClose={(e) => handleRemoveChip(e, id)}
      disabled={isDisabled}
    >
      {fullName}
    </UDSChip>
  );

  const renderSelectWithMore = () => (
    <div className="show-more">
      {selected.map(({ id, fullName }, index) => {
        if (index >= 2) return null;

        return createChip(id, fullName);
      })}
      <span
        role="presentation"
        className="more"
        ref={spanMore}
        onClick={(event: React.FormEvent<HTMLElement>) => {
          setOpenDropDownWithMore(!isOpenDropDownWithMore);
        }}
      >
        {`и ещё ${selected.length - 2}`}
      </span>
    </div>
  );

  const renderSelect = () => {
    if (!selected.length) {
      return <span className="empty">Не выбрано</span>;
    }

    if (selected.length >= 3) {
      return renderSelectWithMore();
    }

    return selected.map(({ id, fullName }) => createChip(id, fullName));
  };

  const filterMembers: (list: IUser[], excluded: ISelectMember[]) => IUser[] = (list, excluded) => {
    return list.filter((member) => !excluded.map((m) => m.id).includes(member.id));
  };

  return (
    <div className={clsx('SelectMembers', classes.root)}>
      <UDSTitle className={clsx('title')} isInvalid={Boolean(errorExecutor)}>
        {title}
      </UDSTitle>
      <div className="select">
        <div
          role="presentation"
          className={clsx('select-box', errorExecutor && 'select-box_error')}
          onClick={openSelect}
        >
          {renderSelect()}
        </div>
      </div>
      {errorExecutor && <p className="error-text">{errorExecutor}</p>}
      {isOpenDropDown && (
        <ClickAwayListener
          onClickAway={() => {
            setOpenDropDown(false);
            setSearchedMembers(Object.values(userList || users));
            setSearch('');
          }}
        >
          <div className="dropdown">
            <UDSInput
              ref={inputRef}
              className={clsx('search')}
              placeholder="Поиск"
              value={search}
              onChange={handleSearch}
            />
            <UDSScroll />
            <div className="search-list">
              {filterMembers(searchedMembers, excluded).map((member) => (
                <UDSCheckbox
                  key={member.id}
                  className={clsx('checkbox')}
                  size="small"
                  text={getUserFullName(member)}
                  checked={!!selected.find(({ id }) => member.id === id)}
                  onChange={selectMember}
                  data-user-id={member.id}
                  data-full-name={getUserFullName(member)}
                />
              ))}
            </div>
          </div>
        </ClickAwayListener>
      )}
      {isOpenDropDownWithMore && (
        <ClickAwayListener
          onClickAway={() => {
            setOpenDropDownWithMore(false);
          }}
        >
          <div className="dropdown">
            <UDSInput
              className={clsx('search')}
              placeholder="Поиск"
              onChange={handleSearchSelected}
            />
            <div className="search-list">
              {searchedSelectedMembers.map((member) => (
                <UDSCheckbox
                  key={member.id}
                  className={clsx('checkbox')}
                  size="small"
                  text={member.fullName}
                  checked
                  onChange={selectMember}
                  data-user-id={member.id}
                  disabled={isDisabled}
                />
              ))}
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default Select;
