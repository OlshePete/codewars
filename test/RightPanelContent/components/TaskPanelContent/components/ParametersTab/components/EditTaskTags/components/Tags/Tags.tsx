import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ClickAwayListener } from '@uds/react-components';
import { Select } from './components/Select';
import { getDropDownChildren } from './mapping';
import { DropDownChildren } from './Tags.types';
import { TagsStyles } from './Tags.styles';
import type { ITags } from './Tags.types';
import './Tags.scss';
import { makeStyles, useTheme } from '@uds/utils';
import { usePanelDataContext } from '../../../../../../../../../SkifTaskPanel/context2/usePanelDataContext';

const useStyles = makeStyles(TagsStyles);

const Tags: React.FC<ITags> = ({ tags, taskTags, setTags }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const dropDownEl = React.useRef<HTMLDivElement>(null);
  const { addTag } = usePanelDataContext();
  const [key, setKey] = useState(DropDownChildren.List);
  const [search, setSearch] = useState('');
  const [filteredTags, setFilteredTags] = useState(tags);
  const [filteredTaskTags, setFilteredTaskTags] = useState(taskTags);
  const [isOpenDropDown, setOpenDropDown] = useState(false);

  useEffect(() => {
    if (Object.keys(taskTags).length === 0 && key === DropDownChildren.ListWithMore) {
      setKey(DropDownChildren.List);
    }
  }, [taskTags]);

  useEffect(() => {
    const newFilteredTags = Object.fromEntries(
      Object.entries(tags).filter((value) => {
        const tag = value[1];

        return tag.name.toLowerCase().includes(search.toLowerCase());
      }),
    );
    setFilteredTags(newFilteredTags);
  }, [search, tags]);

  useEffect(() => {
    const newFilteredTaskTags = Object.fromEntries(
      Object.entries(taskTags).filter((value) => {
        const tag = value[1];
        return tag.name.toLowerCase().includes(search.toLowerCase());
      }),
    );
    setFilteredTaskTags(newFilteredTaskTags);
  }, [search, taskTags]);

  const openSelect = (e: React.FormEvent<HTMLElement>) => {
    if (isOpenDropDown && key !== DropDownChildren.List) {
      e.stopPropagation();
    }
    setKey(DropDownChildren.List);
    setOpenDropDown(true);
  };

  const closeDropDown = () => {
    setSearch('');
    setOpenDropDown(false);
    setKey(DropDownChildren.List);
  };

  const selectTag = (key: string, checked: boolean | undefined) => {
    if (typeof checked === 'boolean') {
      let newTaskTags = taskTags;

      if (!checked) {
        newTaskTags = Object.fromEntries(
          Object.entries(taskTags).filter((value) => {
            const [tagKey] = value;

            return tagKey !== key;
          }),
        );
      } else {
        newTaskTags = { ...taskTags, [key]: tags[key] };
      }
      setTags(newTaskTags);
    }
  };

  const createTag = (name: string, color: string) => {
    setTags({ ...taskTags, [`${name}_${color}`]: { name, color } });
    addTag({ name, color });
    closeDropDown();
  };

  const handlerCancelTagCreation = () => {
    setSearch('');
    setKey(DropDownChildren.List);
  };

  const handlerOpenCreateTag = () => {
    setKey(DropDownChildren.CreateTag);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>, value: string | undefined) => {
    if (typeof value === 'string') {
      setSearch(value);
    }

    if (typeof value === 'undefined') {
      setSearch('');
    }
  };

  const handleRemoveChip = (e: React.SyntheticEvent<HTMLElement, Event>, id: string) => {
    e.stopPropagation();
    const newTaskTags = Object.fromEntries(
      Object.entries(taskTags).filter((value) => {
        const [key] = value;

        return key !== id;
      }),
    );
    setTags(newTaskTags);
  };

  const handlerShowMore = (e: React.FormEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpenDropDown(!(isOpenDropDown && key === DropDownChildren.ListWithMore));
    setKey(DropDownChildren.ListWithMore);
  };

  const onClickAway = () => {
    closeDropDown();
  };

  useEffect(() => {
    if (dropDownEl.current && isOpenDropDown)
      dropDownEl.current.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
  }, [isOpenDropDown, dropDownEl.current]);

  return (
    <div className={clsx('Tags', classes.root)}>
      <Select
        openSelect={openSelect}
        taskTags={taskTags}
        handleRemoveChip={handleRemoveChip}
        handlerShowMore={handlerShowMore}
      />
      {isOpenDropDown && (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className="dropdown" ref={dropDownEl}>
            {getDropDownChildren({
              key,
              search,
              tags,
              taskTags,
              filteredTags,
              filteredTaskTags,
              handlerCancelTagCreation,
              handlerOpenCreateTag,
              createTag,
              selectTag,
              handleSearch,
            })}
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default Tags;
